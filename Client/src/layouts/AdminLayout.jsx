import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  HiOutlineChartBar, 
  HiOutlineShoppingBag, 
  HiOutlineCube, 
  HiOutlineTag,
  HiOutlineArrowLeft,
  HiOutlineMenu,
  HiOutlineX
} from 'react-icons/hi';
import { ShieldCheck } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: HiOutlineChartBar, end: true },
    { label: 'Orders', path: '/admin/orders', icon: HiOutlineShoppingBag },
    { label: 'Products', path: '/admin/products', icon: HiOutlineCube },
    { label: 'Categories', path: '/admin/categories', icon: HiOutlineTag },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="h-screen bg-slate-100 text-slate-800 flex flex-col md:flex-row overflow-hidden">
      
      {/* ---------------- MOBILE TOP BAR ---------------- */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-base font-bold text-slate-900">Admin Panel</span>
        </div>

        <button
          onClick={toggleMobileMenu}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <HiOutlineX className="w-6 h-6" />
          ) : (
            <HiOutlineMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* ---------------- MOBILE BACKDROP ---------------- */}
      {mobileMenuOpen && (
        <div 
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* ---------------- SIDEBAR (FIXED DESKTOP / DRAWER MOBILE) ---------------- */}
      <aside 
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          w-64 bg-white border-r border-slate-200 flex-shrink-0 p-6 flex flex-col justify-between shadow-sm
          transform transition-transform duration-300 ease-in-out h-full
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">Admin Panel</h2>
                <p className="text-[11px] text-slate-400 font-medium">Management Console</p>
              </div>
            </div>

            {/* Mobile Close Button inside drawer */}
            <button 
              onClick={closeMobileMenu}
              className="md:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Back to main store */}
        <button
          onClick={() => {
            closeMobileMenu();
            navigate('/');
          }}
          className="mt-8 flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold border border-slate-200 transition shadow-xs"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back to Store
        </button>
      </aside>

      {/* ---------------- MAIN CONTENT AREA (SCROLLABLE) ---------------- */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-full">
        <Outlet />
      </main>

    </div>
  );
}