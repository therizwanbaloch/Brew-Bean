export const ENDPOINTS = {
  
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  ME: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',

  
  CATEGORIES: '/categories',
  CATEGORY_BY_SLUG: (slug) => `/categories/${slug}`,
  CATEGORY_BY_ID: (id) => `/categories/${id}`,

  
  PRODUCTS: '/products',
  FEATURED_PRODUCTS: '/products/featured/all',
  LATEST_PRODUCTS: '/products/latest',
  SEARCH_PRODUCTS: '/products/search',
  FILTER_PRODUCTS: '/products/filter',
  PRODUCT_BY_SLUG: (slug) => `/products/${slug}`,
  PRODUCT_BY_ID: (id) => `/products/${id}`,

  
  CART: '/cart',
  UPDATE_CART_ITEM: (productId) => `/cart/${productId}`,
  REMOVE_CART_ITEM: (productId) => `/cart/${productId}`,

  
  ORDERS: '/orders',
  MY_ORDERS: '/orders/my-orders',
  CANCEL_ORDER: (id) => `/orders/${id}/cancel`,

  
  REVIEWS: '/reviews',
  PRODUCT_REVIEWS: (productId) => `/reviews/${productId}`,
  REVIEW_BY_ID: (id) => `/reviews/${id}`,


  ADMIN_ORDERS: '/admin/orders',
  ADMIN_UPDATE_ORDER: (id) => `/admin/orders/${id}`,
  ADMIN_DASHBOARD: '/admin/dashboard',
};