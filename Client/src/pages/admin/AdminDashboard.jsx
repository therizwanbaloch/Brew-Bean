import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Users,
  Package,
  FolderTree,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  Calendar,
  Star,
  AlertTriangle,
  Flame,
  PlusCircle,
  Eye,
  Search,
  Bell,
  RefreshCw,
  Sun,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import {
  fetchDashboardStatsAPI,
  fetchDashboardAnalyticsAPI,
  fetchDashboardActivityAPI,
  fetchDashboardInventoryAPI,
  fetchAdminOrdersAPI,
  updateOrderStatusAPI
} from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Live Clock & Weather state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather] = useState({ temp: '28°C', condition: 'Sunny Brew' });

  // API Data States
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [activity, setActivity] = useState({});
  const [inventory, setInventory] = useState({});
  const [allOrders, setAllOrders] = useState([]);

  // UI Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAllDashboardData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, analyticsRes, activityRes, inventoryRes, ordersRes] = await Promise.allSettled([
        fetchDashboardStatsAPI(),
        fetchDashboardAnalyticsAPI(),
        fetchDashboardActivityAPI(),
        fetchDashboardInventoryAPI(),
        fetchAdminOrdersAPI(),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value?.dashboard || {});
      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value?.analytics || {});
      if (activityRes.status === 'fulfilled') setActivity(activityRes.value?.activity || {});
      if (inventoryRes.status === 'fulfilled') setInventory(inventoryRes.value?.inventory || {});
      if (ordersRes.status === 'fulfilled') setAllOrders(ordersRes.value?.orders || ordersRes.value || []);
    } catch (err) {
      toast.error('Failed to sync executive metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllDashboardData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatusAPI(orderId, newStatus);
      toast.success(`Order #${orderId.slice(-6)} changed to ${newStatus}`);
      await loadAllDashboardData();
    } catch (err) {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered' || s === 'completed') {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> {status}</span>;
    }
    if (s === 'pending') {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3 h-3 text-amber-600" /> {status}</span>;
    }
    if (s === 'preparing' || s === 'out for delivery') {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200"><RefreshCw className="w-3 h-3 text-sky-600 animate-spin" /> {status}</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200"><XCircle className="w-3 h-3 text-rose-600" /> {status}</span>;
  };

  const filteredOrders = allOrders.filter((o) => {
    const custName = (o.user?.name || o.customer || '').toLowerCase();
    const orderId = (o._id || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return custName.includes(query) || orderId.includes(query);
  });

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-slate-50 text-slate-700">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs tracking-widest uppercase font-bold text-slate-500">Initializing Power Executive Console...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-slate-50 text-slate-800 p-4 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
      
      {/* 1. TOP NAVBAR / BAR HEADER */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-slate-200 bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md border border-indigo-200">
                Executive Admin Session
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Brew & Bean Operations HQ
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white w-48 sm:w-64 transition"
            />
          </div>

          <button
            onClick={loadAllDashboardData}
            disabled={refreshing}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-2 right-2"></span>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">Admin Console</p>
              <p className="text-[10px] text-slate-500">Superuser</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HERO EXECUTIVE WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Good Day, Executive ☕
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Live operational monitoring and metric feeds are synchronized. All store microservices are executing smoothly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs bg-white/10 p-3 rounded-xl border border-white/15 backdrop-blur-md">
            <div className="flex items-center gap-2 pr-3 border-r border-white/20">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-300 uppercase">Date</p>
                <p className="font-semibold text-white">{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pr-3 border-r border-white/20">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-300 uppercase">Live Time</p>
                <p className="font-semibold text-white font-mono">{currentTime.toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-[10px] text-slate-300 uppercase">Weather</p>
                <p className="font-semibold text-white">{weather.temp} • {weather.condition}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STATISTICS CARDS */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" /> Store Operational Metrics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Total Users', val: stats.totalUsers ?? 0, icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
            { label: 'Products', val: stats.totalProducts ?? 0, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Categories', val: stats.totalCategories ?? 0, icon: FolderTree, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Total Orders', val: stats.totalOrders ?? 0, icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Pending', val: stats.pendingOrders ?? 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Completed', val: stats.completedOrders ?? 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Cancelled', val: stats.cancelledOrders ?? 0, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'Total Revenue', val: `PKR ${(stats.totalRevenue ?? 0).toLocaleString('en-PK')}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50', colSpan: 'col-span-2 sm:col-span-4 lg:col-span-1' },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className={`bg-white border border-slate-200 p-3.5 rounded-2xl space-y-1.5 hover:shadow-md transition ${c.colSpan || ''}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 truncate">{c.label}</span>
                  <div className={`p-1 rounded-lg ${c.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${c.color}`} />
                  </div>
                </div>
                <p className="text-base sm:text-lg font-bold text-slate-900 truncate">{c.val}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FINANCIAL ANALYTICS */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" /> Financial Performance Analytics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
            <p className="text-xs text-slate-500 font-semibold">Today's Performance</p>
            <p className="text-2xl font-bold text-indigo-600">PKR {(analytics.todaySales ?? 0).toLocaleString('en-PK')}</p>
            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Today's Orders:</span>
              <span className="font-bold text-slate-800">{analytics.todayOrders ?? 0}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
            <p className="text-xs text-slate-500 font-semibold">Weekly Performance</p>
            <p className="text-2xl font-bold text-emerald-600">PKR {(analytics.weeklySales ?? 0).toLocaleString('en-PK')}</p>
            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Weekly Orders:</span>
              <span className="font-bold text-slate-800">{analytics.weeklyOrders ?? 0}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
            <p className="text-xs text-slate-500 font-semibold">Monthly Performance</p>
            <p className="text-2xl font-bold text-sky-600">PKR {(analytics.monthlySales ?? 0).toLocaleString('en-PK')}</p>
            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Monthly Orders:</span>
              <span className="font-bold text-slate-800">{analytics.monthlyOrders ?? 0}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
            <p className="text-xs text-slate-500 font-semibold">Average Order Value (AOV)</p>
            <p className="text-2xl font-bold text-purple-600">PKR {(analytics.averageOrderValue ?? 0).toLocaleString('en-PK')}</p>
            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Efficiency Index:</span>
              <span className="font-bold text-emerald-600">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. QUICK ACTIONS & INVENTORY PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Management Shortcuts
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button 
              onClick={() => navigate('/admin/products')}
              className="p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 rounded-xl text-left transition flex flex-col gap-2 group"
            >
              <PlusCircle className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition" />
              <span className="font-semibold text-slate-800">Add Product</span>
            </button>
            <button 
              onClick={() => navigate('/admin/categories')}
              className="p-3 bg-slate-50 hover:bg-purple-50/50 border border-slate-200 rounded-xl text-left transition flex flex-col gap-2 group"
            >
              <FolderTree className="w-5 h-5 text-purple-600 group-hover:scale-110 transition" />
              <span className="font-semibold text-slate-800">Add Category</span>
            </button>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="p-3 bg-slate-50 hover:bg-amber-50/50 border border-slate-200 rounded-xl text-left transition flex flex-col gap-2 group"
            >
              <ShoppingBag className="w-5 h-5 text-amber-600 group-hover:scale-110 transition" />
              <span className="font-semibold text-slate-800">Manage Orders</span>
            </button>
            <button 
              onClick={() => navigate('/admin/products')}
              className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 rounded-xl text-left transition flex flex-col gap-2 group"
            >
              <Eye className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition" />
              <span className="font-semibold text-slate-800">View Products</span>
            </button>
          </div>
        </div>

        {/* Inventory Status Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Stock Level Intelligence
            </h3>
            <span className="text-[10px] text-slate-400">Automated stock warnings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Low Stock */}
            <div className="bg-amber-50/50 border border-amber-200 p-3.5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-amber-800 font-bold">
                <span>Low Stock Items</span>
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md text-[10px]">{inventory.lowStock?.length || 0}</span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {inventory.lowStock && inventory.lowStock.length > 0 ? (
                  inventory.lowStock.map((item, i) => (
                    <div key={i} className="flex justify-between text-[11px] text-slate-700">
                      <span className="truncate">{item.name}</span>
                      <span className="font-bold text-amber-700">{item.stock} left</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 italic">No low stock items.</p>
                )}
              </div>
            </div>

            {/* Out of Stock */}
            <div className="bg-rose-50/50 border border-rose-200 p-3.5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-rose-800 font-bold">
                <span>Out of Stock</span>
                <span className="bg-rose-200 text-rose-900 px-2 py-0.5 rounded-md text-[10px]">{inventory.outOfStock?.length || 0}</span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {inventory.outOfStock && inventory.outOfStock.length > 0 ? (
                  inventory.outOfStock.map((item, i) => (
                    <div key={i} className="flex justify-between text-[11px] text-slate-700">
                      <span className="truncate">{item.name}</span>
                      <span className="font-bold text-rose-600">Empty</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 italic">All items in stock.</p>
                )}
              </div>
            </div>

            {/* Featured Items */}
            <div className="bg-emerald-50/50 border border-emerald-200 p-3.5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-emerald-800 font-bold">
                <span>Featured Items</span>
                <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md text-[10px]">{inventory.featuredProducts?.length || 0}</span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {inventory.featuredProducts && inventory.featuredProducts.length > 0 ? (
                  inventory.featuredProducts.map((item, i) => (
                    <div key={i} className="flex justify-between text-[11px] text-slate-700">
                      <span className="truncate">{item.name}</span>
                      <span className="font-bold text-emerald-700">{item.stock} units</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 italic">No featured products.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. REAL-TIME ACTIVITY FEEDS */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-indigo-600" /> Real-time Activity Stream
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Latest Customers */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" /> Latest Customers
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activity.recentUsers && activity.recentUsers.length > 0 ? (
                activity.recentUsers.map((u, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No recent registrations.</p>
              )}
            </div>
          </div>

          {/* Latest Orders */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Latest Orders
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activity.recentOrders && activity.recentOrders.length > 0 ? (
                activity.recentOrders.map((o, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{o.user?.name || 'Customer'}</p>
                      <p className="text-[10px] text-indigo-600 font-bold">PKR {o.totalPrice}</p>
                    </div>
                    {getStatusBadge(o.orderStatus)}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No recent orders.</p>
              )}
            </div>
          </div>

          {/* Latest Reviews */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Latest Reviews
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activity.recentReviews && activity.recentReviews.length > 0 ? (
                activity.recentReviews.map((r, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{r.user?.name || 'Customer'}</span>
                      <span className="text-amber-500 font-bold flex items-center gap-1">★ {r.rating}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 italic truncate">"{r.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No recent customer reviews.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 7. ALL ORDERS REGISTRY TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Master Store Orders Registry
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update order status, inspect payments, and track store activity.
            </p>
          </div>
          <span className="text-xs bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-slate-700 font-semibold self-start sm:self-auto">
            Total Orders: {filteredOrders.length}
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No matching orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Order ID & Customer</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Current Status</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const customerName = order.user?.name || order.customer || 'Guest User';
                  const amount = order.totalPrice || order.totalAmount || 0;
                  const paymentMethod = order.paymentMethod || 'Cash on Delivery';
                  const status = order.orderStatus || order.status || 'Pending';
                  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today';

                  return (
                    <tr key={order._id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{customerName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">#{order._id}</p>
                      </td>
                      <td className="p-3.5 font-bold text-indigo-600">
                        PKR {amount}
                      </td>
                      <td className="p-3.5">
                        <span className="text-[11px] text-slate-600 block">{paymentMethod}</span>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold">
                          {order.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {getStatusBadge(status)}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {dateStr}
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          disabled={updatingOrderId === order._id}
                          value={status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-800 px-2.5 py-1 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}