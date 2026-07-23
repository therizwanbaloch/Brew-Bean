import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchCartAPI,
  addToCartAPI,
  updateCartItemAPI,
  removeFromCartAPI,
  clearCartAPI,
} from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Default to true to prevent screen flicker

  const extractItems = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.cart?.items) return data.cart.items;
    if (data?.items) return data.items;
    if (data?.cart) return Array.isArray(data.cart) ? data.cart : [];
    return [];
  };

  const refreshCart = useCallback(async () => {
    if (!token) {
      const localCart = localStorage.getItem('guest_cart');
      setCartItems(localCart ? JSON.parse(localCart) : []);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchCartAPI();
      setCartItems(extractItems(data));
    } catch (err) {
      console.error('Error loading cart from server:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (productOrPayload, options = {}) => {
    let payload;

    if (typeof productOrPayload === 'object' && productOrPayload !== null) {
      if (productOrPayload.productId) {
        payload = productOrPayload;
      } else {
        const sizeVal = typeof options.size === 'object' ? options.size.name : options.size;
        payload = {
          productId: productOrPayload._id || productOrPayload.id,
          size: sizeVal || productOrPayload.sizes?.[0]?.name || 'Regular',
          customizations: options.customizations || [],
          quantity: options.quantity || 1,
        };
      }
    } else {
      const sizeVal = typeof options.size === 'object' ? options.size.name : options.size;
      payload = {
        productId: productOrPayload,
        size: sizeVal || 'Regular',
        customizations: options.customizations || [],
        quantity: typeof options === 'number' ? options : options.quantity || 1,
      };
    }

    if (token) {
      try {
        await addToCartAPI(payload);
        await refreshCart();
      } catch (err) {
        console.error('Failed to add to cart:', err);
        throw err;
      }
    } else {
      let updated = [...cartItems];
      const index = updated.findIndex(
        (item) =>
          (item.product?._id || item.productId || item._id) === payload.productId &&
          item.size === payload.size
      );

      if (index > -1) {
        updated[index].quantity += payload.quantity;
      } else {
        updated.push({
          productId: payload.productId,
          size: payload.size,
          customizations: payload.customizations,
          quantity: payload.quantity,
          price: 0,
        });
      }
      localStorage.setItem('guest_cart', JSON.stringify(updated));
      await refreshCart();
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (token) {
      try {
        await updateCartItemAPI(productId, quantity);
        await refreshCart();
      } catch (err) {
        console.error('Failed to update quantity:', err);
      }
    } else {
      const updated = cartItems.map((item) => {
        const id = item.product?._id || item.productId || item._id;
        return id === productId ? { ...item, quantity } : item;
      });
      localStorage.setItem('guest_cart', JSON.stringify(updated));
      await refreshCart();
    }
  };

  const removeFromCart = async (productId) => {
    if (token) {
      try {
        await removeFromCartAPI(productId);
        await refreshCart();
      } catch (err) {
        console.error('Failed to remove item:', err);
      }
    } else {
      const updated = cartItems.filter(
        (item) => (item.product?._id || item.productId || item._id) !== productId
      );
      localStorage.setItem('guest_cart', JSON.stringify(updated));
      await refreshCart();
    }
  };

  const clearCart = async () => {
    if (token) {
      try {
        await clearCartAPI();
        setCartItems([]);
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      localStorage.removeItem('guest_cart');
      setCartItems([]);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.price || item.product?.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);