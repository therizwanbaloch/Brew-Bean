import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import CartDrawer from './components/cart/CartDrawer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          {/* Custom Warm Coffee-themed Toast Notifications */}
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              duration: 3000,
              style: {
                background: '#1C100B',
                color: '#FDFBF7',
                border: '1px solid rgba(62, 39, 35, 0.8)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              },
              success: {
                iconTheme: {
                  primary: '#E67E22',
                  secondary: '#1C100B',
                },
              },
            }} 
          />

          {/* Global Slide-Over Cart Drawer */}
          <CartDrawer />

          {/* Application Routing Hierarchy */}
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;