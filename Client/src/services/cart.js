import API from './api';

export const addToCart = async (productId, quantity = 1) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userId = localStorage.getItem('userId') || user?._id || user?.id;

  if (!token || !userId) {
    throw new Error("You must be logged in to add items to your cart.");
  }

  // Real API Endpoint integration
  const response = await API.post('/cart/add', {
    userId,
    productId,
    quantity,
  });

  return response.data;
};