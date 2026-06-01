import os
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from .models import Base, Product, Customer, Order, OrderItem

# Database Configuration (Reads from Environment Variables)
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("CRITICAL: DATABASE_URL environment variable is not set!")

# Auto-conversion for Render PostgreSQL connection strings to use the async driver
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Auto-conversion of sslmode query parameter to ssl parameter for asyncpg driver compatibility
if "sslmode=" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("sslmode=", "ssl=")

# Set up the Async Engine and Async Session Maker
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

app = FastAPI(title="Inventory & Order Management System API")

# Enable CORS for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint for Render deployment health check
@app.get("/")
def root():
    return {"status": "ok"}

# Asynchronous table creation and PostgreSQL connectivity check on startup
@app.on_event("startup")
async def startup():
    print("LOG: Attempting to connect to PostgreSQL database...")
    try:
        # Establish connection and run tables creation
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("LOG: Connected to PostgreSQL successfully. Database schema initialized.")
    except Exception as e:
        print(f"CRITICAL ERROR: Failed to connect to PostgreSQL on startup: {e}")
        import traceback
        traceback.print_exc()
        # Raise exception to fail the startup and halt the deployment on Render
        raise e

# Dependency to get Async Database Session
async def get_db():
    async with AsyncSessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()

# --- PYDANTIC SCHEMAS (Request/Response Validation) ---

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1)
    sku: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)
    quantity: int = Field(..., ge=0)

class ProductResponse(ProductCreate):
    id: int
    class Config:
        from_attributes = True

class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    phone: str = Field(..., min_length=5)

class CustomerResponse(CustomerCreate):
    id: int
    class Config:
        from_attributes = True

class OrderItemSchema(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemSchema]

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductResponse
    class Config:
        from_attributes = True

class OrderDetailedResponse(BaseModel):
    id: int
    customer_id: int
    customer: CustomerResponse
    total_amount: float
    items: List[OrderItemResponse]
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    total_revenue: float
    low_stock_count: int
    recent_orders: List[OrderDetailedResponse]

# --- API ENDPOINTS ---

# 1. Product Management
@app.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    stmt = select(Product).filter(Product.sku == product.sku)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Product SKU must be unique.")
    
    db_product = Product(**product.model_dump())
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product

@app.get("/products", response_model=List[ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):
    stmt = select(Product).order_by(Product.id.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@app.get("/products/{id}", response_model=ProductResponse)
async def get_product(id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Product).filter(Product.id == id)
    result = await db.execute(stmt)
    prod = result.scalar_one_or_none()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found.")
    return prod

@app.put("/products/{id}", response_model=ProductResponse)
async def update_product(id: int, product_data: ProductCreate, db: AsyncSession = Depends(get_db)):
    stmt = select(Product).filter(Product.id == id)
    result = await db.execute(stmt)
    prod = result.scalar_one_or_none()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    sku_check_stmt = select(Product).filter(Product.sku == product_data.sku, Product.id != id)
    sku_check_result = await db.execute(sku_check_stmt)
    if sku_check_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Product SKU must be unique.")

    for key, value in product_data.model_dump().items():
        setattr(prod, key, value)
    
    await db.commit()
    await db.refresh(prod)
    return prod

@app.delete("/products/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Product).filter(Product.id == id)
    result = await db.execute(stmt)
    prod = result.scalar_one_or_none()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    await db.delete(prod)
    await db.commit()
    return

# 2. Customer Management
@app.post("/customers", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(customer: CustomerCreate, db: AsyncSession = Depends(get_db)):
    stmt = select(Customer).filter(Customer.email == customer.email)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Customer email must be unique.")
    
    db_customer = Customer(**customer.model_dump())
    db.add(db_customer)
    await db.commit()
    await db.refresh(db_customer)
    return db_customer

@app.get("/customers", response_model=List[CustomerResponse])
async def get_customers(db: AsyncSession = Depends(get_db)):
    stmt = select(Customer).order_by(Customer.id.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@app.get("/customers/{id}", response_model=CustomerResponse)
async def get_customer(id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Customer).filter(Customer.id == id)
    result = await db.execute(stmt)
    cust = result.scalar_one_or_none()
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found.")
    return cust

@app.put("/customers/{id}", response_model=CustomerResponse)
async def update_customer(id: int, customer_data: CustomerCreate, db: AsyncSession = Depends(get_db)):
    stmt = select(Customer).filter(Customer.id == id)
    result = await db.execute(stmt)
    cust = result.scalar_one_or_none()
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found.")
    
    email_check_stmt = select(Customer).filter(Customer.email == customer_data.email, Customer.id != id)
    email_check_result = await db.execute(email_check_stmt)
    if email_check_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Customer email must be unique.")

    for key, value in customer_data.model_dump().items():
        setattr(cust, key, value)
    
    await db.commit()
    await db.refresh(cust)
    return cust

@app.delete("/customers/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Customer).filter(Customer.id == id)
    result = await db.execute(stmt)
    cust = result.scalar_one_or_none()
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found.")
    
    await db.delete(cust)
    await db.commit()
    return

# 3. Order Management (Transactional & Stock Validated)
@app.post("/orders", response_model=OrderDetailedResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order_data: OrderCreate, db: AsyncSession = Depends(get_db)):
    # Validate customer existence
    cust_stmt = select(Customer).filter(Customer.id == order_data.customer_id)
    cust_result = await db.execute(cust_stmt)
    customer = cust_result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found.")

    calculated_total = 0.0
    order_items_to_create = []

    # Perform stock validations and operations inside a clean try-catch to rollback on failure
    try:
        for item in order_data.items:
            prod_stmt = select(Product).filter(Product.id == item.product_id)
            prod_result = await db.execute(prod_stmt)
            product = prod_result.scalar_one_or_none()
            
            if not product:
                raise HTTPException(
                    status_code=404, 
                    detail=f"Product with ID {item.product_id} not found."
                )
            
            if product.quantity < item.quantity:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Insufficient inventory for '{product.name}'. Available: {product.quantity}, Requested: {item.quantity}"
                )
            
            # Deduct inventory stock
            product.quantity -= item.quantity
            
            item_cost = product.price * item.quantity
            calculated_total += item_cost
            
            db_order_item = OrderItem(
                product_id=item.product_id,
                quantity=item.quantity
            )
            order_items_to_create.append(db_order_item)

        # Create Order record
        db_order = Order(
            customer_id=order_data.customer_id,
            total_amount=calculated_total,
            items=order_items_to_create
        )
        db.add(db_order)
        await db.commit()
        
        # Load relationships fully before returning to prevent lazy loading exceptions
        stmt = select(Order).options(
            selectinload(Order.customer),
            selectinload(Order.items).selectinload(OrderItem.product)
        ).filter(Order.id == db_order.id)
        
        result = await db.execute(stmt)
        return result.scalar_one()

    except HTTPException:
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while placing the order: {str(e)}"
        )

@app.get("/orders", response_model=List[OrderDetailedResponse])
async def get_orders(db: AsyncSession = Depends(get_db)):
    stmt = select(Order).options(
        selectinload(Order.customer),
        selectinload(Order.items).selectinload(OrderItem.product)
    ).order_by(Order.id.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@app.get("/orders/{id}", response_model=OrderDetailedResponse)
async def get_order(id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Order).options(
        selectinload(Order.customer),
        selectinload(Order.items).selectinload(OrderItem.product)
    ).filter(Order.id == id)
    result = await db.execute(stmt)
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order

# 4. Dashboard Analytics Endpoint
@app.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    # 1. Total Products
    prod_stmt = select(Product)
    prod_result = await db.execute(prod_stmt)
    products = prod_result.scalars().all()
    total_products = len(products)
    
    # 2. Total Customers
    cust_stmt = select(Customer)
    cust_result = await db.execute(cust_stmt)
    total_customers = len(cust_result.scalars().all())
    
    # 3. Total Orders & Revenue
    ord_stmt = select(Order).options(
        selectinload(Order.customer),
        selectinload(Order.items).selectinload(OrderItem.product)
    ).order_by(Order.id.desc())
    ord_result = await db.execute(ord_stmt)
    orders = ord_result.scalars().all()
    total_orders = len(orders)
    
    total_revenue = sum(o.total_amount for o in orders)
    
    # 4. Low stock count (items with quantity < 10)
    low_stock_count = sum(1 for p in products if p.quantity < 10)
    
    # 5. Recent orders (top 5)
    recent_orders = orders[:5]
    
    return DashboardStats(
        total_products=total_products,
        total_customers=total_customers,
        total_orders=total_orders,
        total_revenue=total_revenue,
        low_stock_count=low_stock_count,
        recent_orders=recent_orders
    )