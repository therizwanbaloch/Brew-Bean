import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  HiOutlineChartBar, 
  HiOutlineShoppingBag, 
  HiOutlineCube, 
  HiOutlineArrowLeft 
} from 'react-icons/hi';
import { ShieldCheck } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: HiOutlineChartBar, end: true },
    { label: 'Orders', path: '/admin/orders', icon: HiOutlineShoppingBag },
    { label: 'Products', path: '/admin/products', icon: HiOutlineCube },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 p-6 flex flex-col justify-between shadow-sm">
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">Admin Panel</h2>
              <p className="text-[11px] text-slate-400 font-medium">Management Console</p>
            </div>
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
          onClick={() => navigate('/')}
          className="mt-8 flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold border border-slate-200 transition shadow-xs"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back to Store
        </button>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}