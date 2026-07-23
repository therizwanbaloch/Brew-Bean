import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Security
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Admin Layout & Pages
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';

// Public Auth & Core Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Module 2 Pages
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';

// Module 3 & 4 Pages
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderConfirmationPage from '../pages/OrderConfirmationPage';
import MyOrdersPage from '../pages/MyOrdersPage';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ---------------- PUBLIC & CUSTOMER ROUTES ---------------- */}
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Module 2: Product Discovery & Details */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />

        {/* Public Cart View */}
        <Route path="cart" element={<CartPage />} />

        {/* Protected Customer Routes (Only Logged-in Users/Admins) */}
        <Route element={<ProtectedRoute allowedRoles={['Customer', 'Admin', 'admin']} />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="orders" element={<MyOrdersPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} /> {/* Alias for flexibility */}
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback 404 for main layout */}
        <Route 
          path="*" 
          element={
            <div className="p-20 text-center font-bold text-xl text-amber-100">
              404 - Page Not Found
            </div>
          } 
        />
      </Route>

      {/* ---------------- PROTECTED ADMIN PANEL ROUTES ---------------- */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'admin']} />}>
        <Route path="admin" element={<AdminLayout />}>
          {/* Redirect /admin directly to /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;