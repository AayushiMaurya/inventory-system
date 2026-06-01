# StockStream | Enterprise Inventory & Order Management

StockStream is a premium, production-ready, full-stack inventory and order management system built using high-performance modern web technologies. 

It provides real-time control metrics, product listing management with search filters, client registration matrices, and a high-fidelity dynamic multi-item checkout cart featuring interactive stock level validation and fully atomic PostgreSQL database transaction rollbacks under inventory constraints.

---

## 🚀 Key Features

* **Control Desk**: Quick KPI metrics (Revenue, Order counts, low stock items) and a real-time recent dispatches transaction desk.
* **Transactional Orders & Checked Stock**: Robust checkout system allowing users to build orders with multiple product rows. Real-time client-side warnings alert users if they exceed stock. The backend processes the stock deduction atomically; if any item fails check, the database rollbacks cleanly.
* **Sleek Glassmorphic Interface**: Harmonized slate/indigo color palettes, micro-animations, customizable responsive views, and active loading state indicators.
* **High-Throughput Async Database**: Re-architected on top of FastAPI and SQLAlchemy 2.0 Asynchronous ORM utilizing `asyncpg` to deliver exceptional concurrent checkout performance.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React (Vite), Tailwind CSS, Lucide Icons, Axios, Context State API |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy 2.0 Async, Pydantic v2 |
| **Database** | PostgreSQL 15 |
| **Containerization** | Multi-Stage Docker builds, Docker Compose |

---

## 📦 Project Structure

```text
inventory-system/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py        # Async FastAPI routes, schemas & startup handlers
│   │   └── models.py      # SQLAlchemy 2.0 models & relationships
│   ├── Dockerfile         # Production multi-stage backend builder
│   └── requirements.txt   # Backend dependencies (asyncpg, pydantic-settings, etc.)
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── InventoryContext.jsx # Global Axios state manager
│   │   ├── App.jsx        # Premium dashboard, views & modals
│   │   ├── index.css      # Styling sheets & custom scrollbars
│   │   └── main.jsx       # React mounting entry point
│   ├── Dockerfile         # Production multi-stage Nginx-backed frontend builder
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── vite.config.js     # Vite configuration
│   ├── index.html         # Google Fonts link and index wrapper
│   └── package.json       # Node package manager configuration
└── docker-compose.yml     # Root service orchestration config
```

---

## ⚙️ Local Development Setup

### Option 1: Running with Docker Compose (Recommended)

To run the complete system (Frontend, Backend, and PostgreSQL database) with named volumes using Docker Compose:

1. **Ensure Docker is running** on your system.
2. In the root directory (`/inventory-system`), execute:
   ```bash
   docker compose up --build
   ```
3. Once completed:
   * **Frontend Application**: [http://localhost:3000](http://localhost:3000)
   * **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option 2: Running Locally Without Docker

#### Prerequisites
* Python 3.11+ installed.
* Node.js 20+ installed.
* A running PostgreSQL database instance.

#### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Unix/macOS:
   source venv/bin/activate
   ```
3. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Define your local environment variables. Create a `.env` file or export `DATABASE_URL` (ensure it uses the async driver `postgresql+asyncpg`):
   ```env
   DATABASE_URL=postgresql+asyncpg://<username>:<password>@localhost:5432/<database_name>
   ```
5. Run the FastAPI application:
   ```bash
   uvicorn app.main:app --reload
   ```

#### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at the address printed in the terminal (usually `http://localhost:3000`).

---

## 🌐 Production Cloud Deployment Guides

This guide outlines step-by-step production deployments using **Render** (for the backend and database) and **Vercel** (for the React static frontend).

### Part 1: Deploying the Database & Backend on Render

#### Step 1: Deploy PostgreSQL on Render
1. Sign in to [Render](https://render.com/).
2. Click **New** -> **PostgreSQL**.
3. Fill in the database settings:
   * **Name**: `stockstream-db`
   * **Region**: Choose a region close to your target audience.
4. Click **Create Database**.
5. Once active, locate the **Internal Database URL** (for other Render services) or **External Database URL** (for external access). 
   * *Example URL format:* `postgresql://postgres:user123@dpg-c01...render.com/inventory_db`

#### Step 2: Deploy the FastAPI Backend
1. On Render, click **New** -> **Web Service**.
2. Connect your Git repository.
3. Configure the Web Service:
   * **Name**: `stockstream-backend`
   * **Environment**: `Python`
   * **Root Directory**: `backend` (if deploy is a monorepo, otherwise leave empty if deploying a standalone backend folder)
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Expand the **Advanced** section and add the following Environment Variables:
   * **`DATABASE_URL`**: Enter the Render PostgreSQL URL obtained in Step 1.
     > [!IMPORTANT]
     > Render provides database URLs starting with `postgresql://`. **You MUST modify the prefix to `postgresql+asyncpg://`** to tell SQLAlchemy to use the asynchronous database driver (e.g., `postgresql+asyncpg://postgres:user123@...`).
   * **`PYTHONUNBUFFERED`**: `1`
5. Click **Deploy Web Service**. Render will build the service, run migrations automatically on startup, and provide a public URL (e.g., `https://stockstream-backend.onrender.com`).

---

### Part 2: Deploying the React Frontend on Vercel

Vercel is ideal for hosting highly optimized React Static Web Applications.

1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Select and import your Git repository.
4. Configure the Vercel project:
   * **Project Name**: `stockstream-frontend`
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend` (Click edit and select `frontend` if deploying from a monorepo setup)
5. Expand the **Build and Development Settings** and ensure:
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
6. Expand **Environment Variables** and add the API connection parameter:
   * **`VITE_API_URL`**: Enter the public URL of your Render backend web service (e.g., `https://stockstream-backend.onrender.com`). Do not include a trailing slash.
7. Click **Deploy**. Vercel will compile the React code, bundle assets, and deploy them on a fast, global CDN network.

---

## 🔒 Transactional Integrity Guarantee

StockStream provides robust stock transaction safety under high concurrent demand. When an order is placed:
1. The backend begins a PostgreSQL transactional session.
2. It fetches all requested products and locks them.
3. It verifies that current inventory matches or exceeds requested order quantities.
4. If **any** single item in the order has insufficient stock, the backend throws an HTTP `400 Bad Request` and rolls back the **entire transaction**. No database changes are committed, ensuring inventory is never oversold or corrupted.
5. If all items pass verification, the quantities are deducted, the order items are successfully written, and the transaction is committed atomically.
