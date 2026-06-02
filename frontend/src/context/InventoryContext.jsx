import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const InventoryContext = createContext();

// Detect backend API URL based on environmental configuration
const API_URL = import.meta.env.VITE_API_URL || '/api';
const API = axios.create({ baseURL: API_URL });

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quick alert cleaner helper
  const clearError = () => setError(null);

  // Fetch dashboard analytic summary
  const fetchStats = async () => {
    try {
      const response = await API.get('/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  };

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const response = await API.get('/customers');
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      throw err;
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      throw err;
    }
  };

  // Load all foundational application data concurrently
  const fetchAllData = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchStats(),
        fetchProducts(),
        fetchCustomers(),
        fetchOrders()
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to synchronise data with backend server.');
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  };

  // Run initial bootstrap loading sequence
  useEffect(() => {
    fetchAllData(true);
  }, []);

  // --- CRUD HANDLERS ---

  // Create Product
  const addProduct = async (productData) => {
    try {
      setError(null);
      const response = await API.post('/products', productData);
      setProducts((prev) => [response.data, ...prev]);
      await fetchStats(); // Refresh stats for stock counts
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create product.';
      return { success: false, error: msg };
    }
  };

  // Update Product
  const updateProduct = async (id, productData) => {
    try {
      setError(null);
      const response = await API.put(`/products/${id}`, productData);
      setProducts((prev) =>
        prev.map((prod) => (prod.id === id ? response.data : prod))
      );
      await fetchStats();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update product.';
      return { success: false, error: msg };
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    try {
      setError(null);
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
      await fetchStats();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete product.';
      return { success: false, error: msg };
    }
  };

  // Create Customer
  const addCustomer = async (customerData) => {
    try {
      setError(null);
      const response = await API.post('/customers', customerData);
      setCustomers((prev) => [response.data, ...prev]);
      await fetchStats();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to add customer.';
      return { success: false, error: msg };
    }
  };

  // Update Customer
  const updateCustomer = async (id, customerData) => {
    try {
      setError(null);
      const response = await API.put(`/customers/${id}`, customerData);
      setCustomers((prev) =>
        prev.map((cust) => (cust.id === id ? response.data : cust))
      );
      await fetchStats();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update customer.';
      return { success: false, error: msg };
    }
  };

  // Delete Customer
  const deleteCustomer = async (id) => {
    try {
      setError(null);
      await API.delete(`/customers/${id}`);
      setCustomers((prev) => prev.filter((cust) => cust.id !== id));
      await fetchStats();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete customer.';
      return { success: false, error: msg };
    }
  };

  // Place Order (With atomic inventory deduction and instant sync)
  const createOrder = async (orderData) => {
    try {
      setError(null);
      const response = await API.post('/orders', orderData);
      setOrders((prev) => [response.data, ...prev]);
      
      // Critical Sync Operation: Refresh catalog and dashboard state to show updated stock levels instantly
      await Promise.all([fetchProducts(), fetchStats()]);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to place order.';
      return { success: false, error: msg };
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        customers,
        orders,
        stats,
        loading,
        error,
        clearError,
        fetchAllData,
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        createOrder
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
