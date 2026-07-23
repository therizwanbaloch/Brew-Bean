import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiCheckCircle, HiXCircle, HiClock, HiOutlineShoppingBag } from 'react-icons/hi';
import API from '../services/api';

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(
    location.state?.newOrderCreated ? 'Order placed successfully!' : ''
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders/my-orders');
      if (res.data?.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancellingId(orderId);
      const res = await API.put(`/orders/${orderId}/cancel`);

      if (res.data?.success) {
        // Update local state directly
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: 'Cancelled' } : ord))
        );
        setAlertMessage('Order cancelled successfully.');
        setTimeout(() => setAlertMessage(''), 3000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not cancel order.';
      alert(msg);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
      case 'Cancelled':
        return 'bg-rose-950/80 text-rose-400 border-rose-800';
      case 'Processing':
      case 'Pending':
      default:
        return 'bg-amber-950/80 text-amber-400 border-amber-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C100B] flex items-center justify-center text-[#D2B48C] font-bold">
        Loading order history...
      </div>
    );
  }

  return (
    <div className="bg-[#1C100B] min-h-screen text-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between border-b border-[#3E2723]/60 pb-5">
          <h1 className="text-2xl font-bold font-serif text-[#FDFBF7]">My Orders</h1>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-[#3E2723]/50 text-[#D2B48C] hover:text-[#FDFBF7] text-xs font-bold rounded-xl border border-[#3E2723] transition"
          >
            Order More
          </button>
        </div>

        {alertMessage && (
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-4 py-3 rounded-xl text-xs font-semibold">
            <HiCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{alertMessage}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-[#3E2723]/10 border border-[#3E2723]/40 rounded-3xl space-y-4">
            <HiOutlineShoppingBag className="w-12 h-12 text-[#D2B48C]/40 mx-auto" />
            <p className="text-[#D2B48C]/80 text-sm">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#3E2723]/20 border border-[#3E2723]/60 rounded-2xl p-6 space-y-4 transition hover:border-[#3E2723]"
              >
                {/* Top Row: Order Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-[#3E2723]/40 pb-3">
                  <div>
                    <span className="text-[#D2B48C]/60">Order ID: </span>
                    <span className="font-mono text-[#D2B48C] font-semibold">#{order._id.slice(-6)}</span>
                  </div>
                  <div className="text-[#D2B48C]/60">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus || 'Pending'}
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#1C100B] rounded-xl overflow-hidden border border-[#3E2723] flex-shrink-0">
                        <img
                          src={
                            item.product?.images?.[0] ||
                            item.product?.image ||
                            'https://via.placeholder.com/100?text=Coffee'
                          }
                          alt={item.product?.name || 'Item'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#FDFBF7] truncate">
                          {item.product?.name || 'Menu Item'}
                        </p>
                        <p className="text-xs text-[#D2B48C]/60">
                          Qty: {item.quantity} {item.size ? `| ${item.size}` : ''}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[#D2B48C]">
                        PKR {((item.price || item.product?.price || 0) * item.quantity).toLocaleString('en-PK')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Row: Address, Total & Actions */}
                <div className="pt-3 border-t border-[#3E2723]/40 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="max-w-xs text-[#D2B48C]/70">
                    <span className="font-bold text-[#D2B48C]">Ship to: </span>
                    {order.shippingAddress}
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[#D2B48C]/60">Total: </span>
                      <span className="text-base font-black text-[#E67E22]">
                        PKR {order.totalPrice?.toLocaleString('en-PK')}
                      </span>
                    </div>

                    {/* Cancel action button */}
                    {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className="px-3.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold rounded-xl transition text-xs disabled:opacity-50"
                      >
                        {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}