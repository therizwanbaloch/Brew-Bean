import axios from 'axios';

const API = axios.create({
  baseURL: 'https://brew-bean.onrender.com/api',
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
// PRODUCTS ENDPOINTS
// ==========================================

export const fetchProductBySlugAPI = async (slug) => {
  const response = await API.get(`/products/${slug}`);
  return response.data;
};

// ==========================================
// REVIEWS ENDPOINTS
// ==========================================

export const fetchReviewsAPI = async (productId) => {
  const response = await API.get(`/reviews/${productId}`);
  return response.data;
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

export const clearCartAPI = async () => {
  const response = await API.delete('/cart');
  return response.data;
};

// ==========================================
// CATEGORIES ENDPOINTS
// ==========================================

export const fetchCategoriesAPI = async () => {
  const response = await API.get('/categories');
  return response.data?.categories || response.data || [];
};

export const createCategoryAPI = async (categoryData) => {
  const response = await API.post('/categories', categoryData);
  return response.data;
};

export const updateCategoryAPI = async (id, categoryData) => {
  const response = await API.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategoryAPI = async (id) => {
  const response = await API.delete(`/categories/${id}`);
  return response.data;
};

// ==========================================
// ADMIN & DASHBOARD ENDPOINTS
// ==========================================

export const fetchDashboardStatsAPI = async () => {
  const response = await API.get('/admin/dashboard');
  return response.data;
};

export const fetchDashboardAnalyticsAPI = async () => {
  const response = await API.get('/admin/dashboard/analytics');
  return response.data;
};

export const fetchDashboardActivityAPI = async () => {
  const response = await API.get('/admin/dashboard/activity');
  return response.data;
};

export const fetchDashboardInventoryAPI = async () => {
  const response = await API.get('/admin/dashboard/inventory');
  return response.data;
};

export const fetchAdminOrdersAPI = async () => {
  const response = await API.get('/admin/orders');
  return response.data;
};

export const updateOrderStatusAPI = async (orderId, orderStatus) => {
  const response = await API.put(`/admin/orders/${orderId}`, { orderStatus });
  return response.data;
};

export const fetchAdminProductsAPI = async () => {
  const response = await API.get('/products');
  return response.data;
};

export const createProductAPI = async (productData) => {
  const response = await API.post('/products', productData);
  return response.data;
};

export const updateProductAPI = async (productId, productData) => {
  const response = await API.put(`/products/${productId}`, productData);
  return response.data;
};

export const deleteProductAPI = async (productId) => {
  const response = await API.delete(`/products/${productId}`);
  return response.data;
};

export default API;