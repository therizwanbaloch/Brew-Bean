import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  ShoppingBag, 
  RefreshCw, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  User, 
  CreditCard 
} from 'lucide-react';
import { fetchAdminOrdersAPI, updateOrderStatusAPI } from '../../services/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOrdersAPI();
      setOrders(Array.isArray(data) ? data : data?.orders || []);
    } catch (err) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatusAPI(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus, orderStatus: newStatus } : o))
      );
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    if (s === 'completed' || s === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {statusStr}
        </span>
      );
    }
    if (s === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" /> {statusStr}
        </span>
      );
    }
    if (s === 'preparing' || s === 'out for delivery') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
          <RefreshCw className="w-3 h-3 text-sky-600 animate-spin" /> {statusStr}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
        <XCircle className="w-3 h-3 text-rose-600" /> {statusStr}
      </span>
    );
  };

  const filteredOrders = orders.filter((o) => {
    const custName = (o.user?.name || o.customer || o.shippingAddress || '').toLowerCase();
    const orderId = (o._id || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return custName.includes(query) || orderId.includes(query);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 text-slate-500">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold tracking-wider uppercase">Fetching Store Orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-50 border border-amber-100 rounded-xl text-amber-600">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Order Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Review, filter, and modify live customer orders.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <button
            onClick={loadOrders}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Items & Preview</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No orders match your query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemsList = order.items || order.orderItems || [];
                  const currentStatus = order.status || order.orderStatus || 'Pending';

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/80 transition">
                      {/* ID */}
                      <td className="p-4 font-mono font-bold text-indigo-600">
                        #{order._id?.slice(-6)}
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{order.user?.name || order.customer || 'Guest Customer'}</p>
                            <p className="text-[10px] text-slate-400">{order.user?.email || order.shippingAddress || ''}</p>
                          </div>
                        </div>
                      </td>

                      {/* Items with Cloudinary / Backend Image preview */}
                      <td className="p-4 max-w-xs">
                        <div className="space-y-1.5">
                          {itemsList.map((it, i) => {
                            const imgUrl = it.product?.image || it.image || '';
                            const name = it.product?.name || it.name || 'Coffee Product';
                            return (
                              <div key={i} className="flex items-center gap-2 text-slate-700">
                                {imgUrl ? (
                                  <img 
                                    src={imgUrl} 
                                    alt={name} 
                                    className="w-6 h-6 rounded-md object-cover border border-slate-200"
                                  />
                                ) : (
                                  <span className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                                    ☕
                                  </span>
                                )}
                                <span className="truncate text-xs">
                                  {name} <span className="font-bold text-slate-500">(x{it.quantity})</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="p-4 font-bold text-slate-900">
                        PKR {(order.totalAmount || order.totalPrice || 0).toLocaleString('en-PK')}
                      </td>

                      {/* Payment */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium">{order.paymentMethod || 'COD'}</span>
                        </div>
                      </td>

                      {/* Current Status Badge */}
                      <td className="p-4">
                        {getStatusBadge(currentStatus)}
                      </td>

                      {/* Status Dropdown Action */}
                      <td className="p-4 text-right">
                        <select
                          disabled={updatingId === order._id}
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500 transition disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}