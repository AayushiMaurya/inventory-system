import React, { useState } from 'react';
import { useInventory, InventoryProvider } from './context/InventoryContext';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Plus,
  Edit2,
  Trash2,
  Search,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  DollarSign,
  User,
  Mail,
  Phone,
  BarChart2,
  PlusCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

function DashboardView() {
  const { stats, products, customers, orders } = useInventory();

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm">Preparing analysis boards...</p>
      </div>
    );
  }

  // Get top low stock products
  const lowStockItems = products.filter(p => p.quantity < 10).slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
          Welcome to <span className="gradient-text">StockStream</span>
        </h1>
        <p className="text-slate-400 mt-1">Real-time analytical insights and supply operations control desk.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="glass-panel rounded-2xl p-6 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-300"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</p>
              <h3 className="text-3xl font-bold mt-2 text-white">${stats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>Platform transactions lifetime</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-panel rounded-2xl p-6 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-300"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Orders</p>
              <h3 className="text-3xl font-bold mt-2 text-white">{stats.total_orders}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Active dispatched client orders
          </div>
        </div>

        {/* Total Products */}
        <div className="glass-panel rounded-2xl p-6 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-300"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Unique Products</p>
              <h3 className="text-3xl font-bold mt-2 text-white">{stats.total_products}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Catalog inventory entries
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-panel rounded-2xl p-6 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-300"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Low Stock Warnings</p>
              <h3 className="text-3xl font-bold mt-2 text-white">{stats.low_stock_count}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400 flex items-center">
            {stats.low_stock_count > 0 ? (
              <span className="text-amber-400 font-medium">Immediate replenishment needed</span>
            ) : (
              <span className="text-slate-400">Inventory levels catalog-healthy</span>
            )}
          </div>
        </div>
      </div>

      {/* Tables Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Panel */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <span>Recent Dispatches</span>
            </h2>
            <span className="text-xs font-medium text-indigo-400 py-1 px-3 bg-indigo-500/10 rounded-full">Active Sync</span>
          </div>

          {stats.recent_orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2">
              <ShoppingCart className="w-8 h-8 opacity-40" />
              <p className="text-sm">No transaction dispatches registered yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 overflow-hidden">
              {stats.recent_orders.map((order) => (
                <div key={order.id} className="py-4 flex items-center justify-between group hover:bg-slate-900/20 px-2 rounded-xl transition-all duration-200">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      Order #{String(order.id).padStart(4, '0')}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center space-x-2">
                      <span className="font-medium text-indigo-300">{order.customer.name}</span>
                      <span className="text-slate-600">•</span>
                      <span>{order.items.length} items ordered</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">${order.total_amount.toFixed(2)}</p>
                    <span className="text-[10px] text-slate-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 font-medium">Dispatched</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Watchlist Panel */}
        <div className="glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>Low-Stock Alerts</span>
            </h2>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full font-semibold">Stock &lt; 10</span>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400/80 animate-bounce" />
              <p className="text-sm">All products fully stocked!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lowStockItems.map((prod) => (
                <div key={prod.id} className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white truncate max-w-[140px]">{prod.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{prod.sku}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold leading-none ${
                      prod.quantity === 0 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {prod.quantity === 0 ? 'Out of stock' : `${prod.quantity} Left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductsView() {
  const { products, addProduct, updateProduct, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [modalError, setModalError] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditing(false);
    setName('');
    setSku('');
    setPrice('');
    setQuantity('');
    setModalError('');
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setIsEditing(true);
    setEditingId(prod.id);
    setName(prod.name);
    setSku(prod.sku);
    setPrice(prod.price.toString());
    setQuantity(prod.quantity.toString());
    setModalError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!name.trim() || !sku.trim() || !price || !quantity) {
      setModalError('All fields must be filled.');
      return;
    }

    const priceNum = parseFloat(price);
    const qtyNum = parseInt(quantity, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      setModalError('Price must be a valid positive number.');
      return;
    }

    if (isNaN(qtyNum) || qtyNum < 0) {
      setModalError('Quantity must be a valid non-negative integer.');
      return;
    }

    const productPayload = {
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      price: priceNum,
      quantity: qtyNum,
    };

    let response;
    if (isEditing) {
      response = await updateProduct(editingId, productPayload);
    } else {
      response = await addProduct(productPayload);
    }

    if (response.success) {
      setModalOpen(false);
    } else {
      setModalError(response.error);
    }
  };

  const handleDelete = async (id, prodName) => {
    if (window.confirm(`Are you sure you want to delete product "${prodName}"?`)) {
      const response = await deleteProduct(id);
      if (!response.success) {
        alert(response.error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Product Inventory</h1>
          <p className="text-slate-400 mt-1">Manage catalog listings, pricing parameters, and item stock levels.</p>
        </div>
        <button
          onClick={openAddModal}
          className="glow-btn-indigo bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl flex items-center space-x-2 shrink-0 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Table Panel */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {/* Search Bar Container */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/10 flex items-center">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search products by SKU or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm placeholder-slate-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-2 bg-slate-900/10">
              <Package className="w-12 h-12 opacity-30 animate-pulse" />
              <p className="text-base font-medium">No matching products found.</p>
              <p className="text-xs text-slate-600">Try refining search parameters or creating a new product.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-900/20">
                  <th className="py-4 px-6">SKU</th>
                  <th className="py-4 px-6">Product Name</th>
                  <th className="py-4 px-6">Unit Price</th>
                  <th className="py-4 px-6">Stock Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-4 px-6 font-mono text-sm text-indigo-400 font-semibold">{prod.sku}</td>
                    <td className="py-4 px-6 text-sm font-medium text-white">{prod.name}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-300">${prod.price.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none ${
                        prod.quantity === 0
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : prod.quantity < 10
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {prod.quantity === 0 ? (
                          <>Out of stock</>
                        ) : prod.quantity < 10 ? (
                          <>Low Stock ({prod.quantity})</>
                        ) : (
                          <>In Stock ({prod.quantity})</>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors"
                          title="Edit product parameters"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                          title="Remove product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form Overlay Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-scaleUp">
            {/* Modal Title */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {isEditing ? 'Modify Catalog Entry' : 'Create New Product'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Premium Leather Sneakers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm placeholder-slate-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SKU Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SHOE-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm placeholder-slate-600 font-mono uppercase"
                    disabled={isEditing}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm placeholder-slate-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Starting Stock Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm placeholder-slate-600"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glow-btn-indigo bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-5 rounded-xl text-sm font-bold transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomersView() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [modalError, setModalError] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditing(false);
    setName('');
    setEmail('');
    setPhone('');
    setModalError('');
    setModalOpen(true);
  };

  const openEditModal = (cust) => {
    setIsEditing(true);
    setEditingId(cust.id);
    setName(cust.name);
    setEmail(cust.email);
    setPhone(cust.phone);
    setModalError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setModalError('All fields must be filled.');
      return;
    }

    const customerPayload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    };

    let response;
    if (isEditing) {
      response = await updateCustomer(editingId, customerPayload);
    } else {
      response = await addCustomer(customerPayload);
    }

    if (response.success) {
      setModalOpen(false);
    } else {
      setModalError(response.error);
    }
  };

  const handleDelete = async (id, custName) => {
    const confirmation = window.confirm(
      `WARNING: Deleting customer "${custName}" will permanently remove all orders and dispatch histories associated with this user. Continue?`
    );
    if (confirmation) {
      const response = await deleteCustomer(id);
      if (!response.success) {
        alert(response.error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Customer Database</h1>
          <p className="text-slate-400 mt-1">Manage client records, communication metrics, and transaction entities.</p>
        </div>
        <button
          onClick={openAddModal}
          className="glow-btn-indigo bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl flex items-center space-x-2 shrink-0 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Filter and Table Panel */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {/* Search Bar Container */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/10 flex items-center">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm placeholder-slate-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-2 bg-slate-900/10">
              <Users className="w-12 h-12 opacity-30 animate-pulse" />
              <p className="text-base font-medium">No matching customers found.</p>
              <p className="text-xs text-slate-600">Ensure the filter text is correct or add a new record.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-900/20">
                  <th className="py-4 px-6">Customer Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-white flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 text-xs font-bold uppercase">
                        {cust.name.substring(0, 2)}
                      </div>
                      <span>{cust.name}</span>
                    </td>
                    <td className="py-4 px-6 text-sm font-mono text-slate-300">{cust.email}</td>
                    <td className="py-4 px-6 text-sm text-slate-400">{cust.phone}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(cust)}
                          className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors"
                          title="Modify customer details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cust.id, cust.name)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                          title="Remove customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form Overlay Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-scaleUp">
            {/* Modal Title */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {isEditing ? 'Modify Customer Profile' : 'Register New Client'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Customer Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm placeholder-slate-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. johndoe@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm placeholder-slate-600 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm placeholder-slate-600"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glow-btn-indigo bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-5 rounded-xl text-sm font-bold transition-colors"
                >
                  {isEditing ? 'Save Details' : 'Register Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersView() {
  const { orders, customers, products, createOrder } = useInventory();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  
  // Custom Dynamic Multi-Item Order State
  const [orderItems, setOrderItems] = useState([{ product_id: '', quantity: 1 }]);
  const [modalError, setModalError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrderExpand = (id) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddItemRow = () => {
    setOrderItems(prev => [...prev, { product_id: '', quantity: 1 }]);
  };

  const handleRemoveItemRow = (index) => {
    if (orderItems.length === 1) return;
    setOrderItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    setOrderItems(prev =>
      prev.map((item, idx) => {
        if (idx === index) {
          if (field === 'product_id') {
            return { ...item, product_id: value };
          }
          if (field === 'quantity') {
            const qty = parseInt(value, 10);
            return { ...item, quantity: isNaN(qty) ? '' : qty };
          }
        }
        return item;
      })
    );
  };

  const openCreateModal = () => {
    setSelectedCustomerId('');
    setOrderItems([{ product_id: '', quantity: 1 }]);
    setModalError('');
    setModalOpen(true);
  };

  // Calculate dynamic totals for the order panel
  const calculateModalTotal = () => {
    return orderItems.reduce((acc, item) => {
      if (!item.product_id) return acc;
      const prod = products.find(p => p.id === parseInt(item.product_id, 10));
      if (!prod) return acc;
      return acc + prod.price * (item.quantity || 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!selectedCustomerId) {
      setModalError('Please select a customer.');
      return;
    }

    if (orderItems.length === 0) {
      setModalError('Please add at least one product row.');
      return;
    }

    // Client-Side Guard Rails & Validation checks
    const uniqueProductIds = new Set();
    const formattedItems = [];

    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      if (!item.product_id) {
        setModalError(`Row #${i + 1} does not have a selected product.`);
        return;
      }

      if (!item.quantity || item.quantity <= 0) {
        setModalError(`Row #${i + 1} has an invalid quantity. Must be at least 1.`);
        return;
      }

      if (uniqueProductIds.has(item.product_id)) {
        setModalError('Duplicate items found. Merge quantities into a single item row.');
        return;
      }
      uniqueProductIds.add(item.product_id);

      const prodId = parseInt(item.product_id, 10);
      const targetProduct = products.find(p => p.id === prodId);

      if (!targetProduct) {
        setModalError(`Invalid product selected at Row #${i + 1}`);
        return;
      }

      if (targetProduct.quantity < item.quantity) {
        setModalError(
          `Insufficient stock for "${targetProduct.name}". Remaining stock: ${targetProduct.quantity}, Requested: ${item.quantity}`
        );
        return;
      }

      formattedItems.push({
        product_id: prodId,
        quantity: item.quantity
      });
    }

    const payload = {
      customer_id: parseInt(selectedCustomerId, 10),
      items: formattedItems
    };

    const response = await createOrder(payload);
    if (response.success) {
      setModalOpen(false);
    } else {
      setModalError(response.error);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Order Dispatches</h1>
          <p className="text-slate-400 mt-1">Manage, verify, and trace transactional sales and item flows.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="glow-btn-indigo bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl flex items-center space-x-2 shrink-0 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Dispatch Checkout</span>
        </button>
      </div>

      {/* Orders List Container */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-slate-500 space-y-3 bg-slate-900/10">
            <ShoppingCart className="w-12 h-12 opacity-30 animate-pulse" />
            <p className="text-base font-semibold">No order dispatches placed yet.</p>
            <p className="text-xs text-slate-600">Initiate a dispatch workflow to record client sales.</p>
          </div>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedOrders[order.id];
            return (
              <div
                key={order.id}
                className={`glass-panel rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isExpanded ? 'border-indigo-500/30' : 'border-slate-800/80 hover:border-slate-700/60'
                }`}
              >
                {/* Summary Row */}
                <div
                  onClick={() => toggleOrderExpand(order.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/15 transition-all select-none"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Order #{String(order.id).padStart(4, '0')}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                        <span className="font-semibold text-indigo-300">{order.customer.name}</span>
                        <span className="text-slate-600">•</span>
                        <span>{order.customer.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-left md:text-right">
                      <p className="text-sm text-slate-500 uppercase tracking-wider text-[10px] font-bold">Grand Total</p>
                      <p className="text-lg font-black text-emerald-400 mt-0.5">${order.total_amount.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                        Dispatched
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 bg-slate-900/10 p-6 space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dispatched Package Items</h4>
                    <div className="divide-y divide-slate-800/60">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-white">{item.product.name}</p>
                            <p className="text-xs text-slate-500 font-mono">SKU: {item.product.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-300">
                              <span className="font-semibold text-white">{item.quantity}</span> x ${item.product.price.toFixed(2)}
                            </p>
                            <p className="text-xs font-bold text-slate-400 mt-0.5">
                              Sub: ${(item.quantity * item.product.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Dynamic Order Creator Checkout Overlay Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-scaleUp">
            {/* Modal Title */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <ShoppingCart className="w-6 h-6 text-indigo-400" />
                <span>Initiate Order Dispatch Checkout</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {modalError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Step 1: Customer Select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">1. Select Target Customer Profile</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
                  required
                >
                  <option value="">-- Choose registered customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
                {customers.length === 0 && (
                  <p className="text-[10px] text-amber-400 flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Please register at least one customer first to place an order.</span>
                  </p>
                )}
              </div>

              {/* Step 2: Line Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">2. Product Package Elements</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item Line</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {orderItems.map((item, index) => {
                    const selectedProd = products.find(p => p.id === parseInt(item.product_id, 10));
                    const isStockSufficient = selectedProd ? selectedProd.quantity >= item.quantity : true;

                    return (
                      <div key={index} className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 space-y-3.5">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <select
                              value={item.product_id}
                              onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm truncate"
                              required
                            >
                              <option value="">-- Select Product --</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} (${p.price.toFixed(2)}) [Available: {p.quantity}]
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="w-24 shrink-0">
                            <input
                              type="number"
                              min="1"
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm text-center"
                              required
                            />
                          </div>

                          {orderItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(index)}
                              className="text-rose-500 hover:text-rose-400 p-2 shrink-0 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        {/* In-Line Stock Validation Indicators */}
                        {selectedProd && (
                          <div className="flex items-center justify-between text-xs px-1">
                            <span className="text-slate-400">
                              Unit Cost: <span className="font-semibold text-slate-300">${selectedProd.price.toFixed(2)}</span>
                            </span>

                            {!isStockSufficient ? (
                              <span className="text-rose-400 font-bold flex items-center space-x-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0 animate-ping" />
                                <span>Insufficient inventory! ({selectedProd.quantity} available)</span>
                              </span>
                            ) : (
                              <span className="text-emerald-400 font-medium">
                                Subtotal: <span className="font-bold">${(selectedProd.price * (item.quantity || 0)).toFixed(2)}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="p-6 border-t border-slate-800 flex items-center justify-between bg-slate-900/10">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Checkout Estimation</span>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">${calculateModalTotal().toFixed(2)}</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="glow-btn-indigo bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-6 rounded-xl text-sm font-bold flex items-center space-x-2 transition-colors"
                >
                  <CheckCircle className="w-4.5 h-4.5" />
                  <span>Execute Order Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { loading, error, clearError, fetchAllData } = useInventory();

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    clearError();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'products':
        return <ProductsView />;
      case 'customers':
        return <CustomersView />;
      case 'orders':
        return <OrdersView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 relative">
      {/* Global Sync Overlay loading spinner */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-indigo-400 font-semibold tracking-wider uppercase text-xs animate-pulse">Syncing platform ledgers...</p>
        </div>
      )}

      {/* Modern Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/80 shrink-0 flex flex-col md:sticky md:top-0 md:h-screen">
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-white font-sans tracking-tight">StockStream</h2>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase font-mono leading-none">v1.0.0 Stable</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span>Control Dashboard</span>
          </button>

          <button
            onClick={() => handleTabChange('products')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
            }`}
          >
            <Package className="w-5 h-5 shrink-0" />
            <span>Product Catalog</span>
          </button>

          <button
            onClick={() => handleTabChange('customers')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'customers'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span>Customer Database</span>
          </button>

          <button
            onClick={() => handleTabChange('orders')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
            }`}
          >
            <ShoppingCart className="w-5 h-5 shrink-0" />
            <span>Order Dispatches</span>
          </button>
        </nav>

        {/* Global Connection state footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 flex items-center justify-between text-xs text-slate-500">
          <span>Server status</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-400 font-semibold uppercase font-mono text-[10px]">Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-x-hidden min-w-0">
        {/* Error Alert bar */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-sm flex items-center justify-between gap-4 animate-slideDown shadow-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="p-1 hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sub-view Content renderer */}
        {renderContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <InventoryProvider>
      <MainLayout />
    </InventoryProvider>
  );
}
