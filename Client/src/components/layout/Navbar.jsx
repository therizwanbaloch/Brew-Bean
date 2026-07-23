import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlineSearch, 
  HiOutlineShoppingBag, 
  HiOutlineUser, 
  HiOutlineMenu, 
  HiOutlineX,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import { FiCoffee } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  // Live dynamic cart count and drawer trigger from Context
  const { cartCount, openCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setMenuOpen(false);
    }
  };

  const handleCartClick = () => {
    if (openCart) {
      openCart();
    } else {
      navigate('/cart');
    }
  };

  return (
    <nav className="bg-amber-950 text-amber-50 sticky top-0 z-40 shadow-xl border-b border-amber-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
              <FiCoffee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider uppercase font-serif text-amber-100 block leading-none">
                Brew <span className="text-amber-500">&</span> Bean
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-sans font-semibold">
                Artisanal Roastery
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs mx-8 relative">
            <input
              type="text"
              placeholder="Search cappuccino, espresso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-amber-900/40 text-amber-100 placeholder-amber-400/70 px-4 py-2 pl-10 rounded-full border border-amber-800/60 focus:outline-none focus:border-amber-500 text-sm transition"
            />
            <HiOutlineSearch className="absolute left-3 top-2.5 text-amber-400 w-4 h-4" />
          </form>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-amber-400 transition">Home</Link>
            <Link to="/products" className="hover:text-amber-400 transition">Menu</Link>
            
            {isAdmin && (
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-800/60 text-amber-300 rounded-md hover:bg-amber-800 border border-amber-700 transition"
              >
                <HiOutlineShieldCheck className="w-4 h-4 text-amber-400" />
                Admin Panel
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4 border-l border-amber-800/80 pl-6">
                <Link to="/my-orders" className="flex items-center gap-1 hover:text-amber-400 transition">
                  <HiOutlineClipboardList className="w-4 h-4" />
                  My Orders
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-amber-300/80 hover:text-red-400 transition text-xs uppercase tracking-wider"
                >
                  <HiOutlineLogout className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-amber-800/80 pl-6">
                <Link to="/login" className="flex items-center gap-1 hover:text-amber-400 transition">
                  <HiOutlineUser className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold px-4 py-2 rounded-full transition shadow-md"
                >
                  Join Us
                </Link>
              </div>
            )}

            {/* Cart Trigger with Real DB Badge Count */}
            <button
              onClick={handleCartClick}
              className="relative bg-amber-900/60 p-2.5 rounded-full hover:bg-amber-800 transition border border-amber-800"
              aria-label="Open Cart"
            >
              <HiOutlineShoppingBag className="w-5 h-5 text-amber-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-amber-950 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu & Cart Buttons */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={handleCartClick}
              className="relative p-2 text-amber-200"
              aria-label="Open Cart"
            >
              <HiOutlineShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-500 text-amber-950 font-bold text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-amber-200 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <HiOutlineX className="w-7 h-7" /> : <HiOutlineMenu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-amber-900/95 border-b border-amber-800 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearch} className="mb-4 relative">
            <input
              type="text"
              placeholder="Search coffee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-amber-950 text-amber-100 placeholder-amber-400/70 px-4 py-2 pl-10 rounded-lg text-sm border border-amber-800"
            />
            <HiOutlineSearch className="absolute left-3 top-2.5 text-amber-400 w-4 h-4" />
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-amber-100 border-b border-amber-800/50">Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 text-amber-100 border-b border-amber-800/50">Full Menu</Link>
          {user && (
            <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-amber-100 border-b border-amber-800/50">
              <HiOutlineClipboardList className="w-4 h-4" />
              My Orders
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-amber-300 font-bold">
              <HiOutlineShieldCheck className="w-4 h-4" />
              Admin Dashboard
            </Link>
          )}
          {!user ? (
            <div className="pt-2 flex gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 bg-amber-800 rounded-md">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 bg-amber-600 text-amber-950 font-bold rounded-md">Register</Link>
            </div>
          ) : (
            <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 w-full text-left py-2 text-red-400">
              <HiOutlineLogout className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}