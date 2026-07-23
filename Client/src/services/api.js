import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer token dynamically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// AUTH ENDPOINTS
// ==========================================

export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Registration failed.';
    throw new Error(errorMsg);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Login failed. Invalid credentials.';
    throw new Error(errorMsg);
  }
};

// ==========================================
// CART ENDPOINTS
// ==========================================

export const fetchCartAPI = async () => {
  const response = await API.get('/cart');
  return response.data;
};

export const addToCartAPI = async (param1, param2, param3, param4) => {
  let payload;

  if (typeof param1 === 'object' && param1 !== null) {
    const sizeVal = typeof param1.size === 'object' ? param1.size?.name : param1.size;
    payload = {
      productId: param1.productId || param1._id || param1.id,
      size: sizeVal || 'Regular',
      customizations: Array.isArray(param1.customizations)
        ? param1.customizations.map((c) => (typeof c === 'object' ? c.name : c))
        : [],
      quantity: Number(param1.quantity) || 1,
    };
  } else {
    const sizeVal = typeof param2 === 'object' ? param2?.name : param2;
    payload = {
      productId: param1,
      size: sizeVal || 'Regular',
      customizations: Array.isArray(param3)
        ? param3.map((c) => (typeof c === 'object' ? c.name : c))
        : [],
      quantity: Number(param4) || 1,
    };
  }

  const response = await API.post('/cart', payload);
  return response.data;
};

export const updateCartItemAPI = async (productId, quantity) => {
  const response = await API.put(`/cart/${productId}`, { quantity });
  return response.data;
};

export const removeFromCartAPI = async (productId) => {
  const response = await API.delete(`/cart/${productId}`);
  return response.data;
};

export const clearCartAPI = async (productId) => {
  const response = await API.delete('/cart');
  return response.data;
};

// ==========================================
// ADMIN & DASHBOARD ENDPOINTS
// ==========================================

// 1. Overall Dashboard Statistics
export const fetchDashboardStatsAPI = async () => {
  const response = await API.get('/admin/dashboard');
  return response.data;
};

// 2. Dashboard Analytics (Today, Weekly, Monthly)
export const fetchDashboardAnalyticsAPI = async () => {
  const response = await API.get('/admin/dashboard/analytics');
  return response.data;
};

// 3. Dashboard Activity (Recent Users, Orders, Reviews)
export const fetchDashboardActivityAPI = async () => {
  const response = await API.get('/admin/dashboard/activity');
  return response.data;
};

// 4. Inventory Overview (Low stock, Out of stock, Featured)
export const fetchDashboardInventoryAPI = async () => {
  const response = await API.get('/admin/dashboard/inventory');
  return response.data;
};

// 5. Get All Orders
export const fetchAdminOrdersAPI = async () => {
  const response = await API.get('/admin/orders');
  return response.data;
};

// 6. Update Order Status ('Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled')
export const updateOrderStatusAPI = async (orderId, orderStatus) => {
  const response = await API.put(`/admin/orders/${orderId}`, { orderStatus });
  return response.data;
};

// Get all products (Admin view)
export const fetchAdminProductsAPI = async () => {
  const response = await API.get('/products');
  return response.data;
};

// Create a new product
export const createProductAPI = async (productData) => {
  const response = await API.post('/products', productData);
  return response.data;
};

// Update existing product
export const updateProductAPI = async (productId, productData) => {
  const response = await API.put(`/products/${productId}`, productData);
  return response.data;
};

// Delete product
export const deleteProductAPI = async (productId) => {
  const response = await API.delete(`/products/${productId}`);
  return response.data;
};

export default API;