import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiHome, FiPrinter } from 'react-icons/fi';

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem('brewbean_last_order');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-[70vh] bg-[#1C100B] text-[#FDFBF7] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold">No Recent Order Found</h2>
        <Link to="/products" className="px-6 py-2.5 rounded-xl bg-[#E67E22] text-[#1C100B] font-bold text-xs uppercase tracking-wider">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C100B] text-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 text-center">
        
        {/* Top Success Badge */}
        <div className="space-y-3">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <FiCheckCircle className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Thank You for Your Order!</h1>
          <p className="text-xs text-[#D2B48C]">
            We’ve received your order <span className="font-bold text-[#E67E22]">#{order.orderId}</span> and our roasters are preparing your fresh batch.
          </p>
        </div>

        {/* Receipt Card */}
        <div className="bg-[#3E2723]/20 border border-[#3E2723]/80 p-6 sm:p-8 rounded-3xl text-left space-y-6">
          <div className="flex justify-between items-center border-b border-[#3E2723]/80 pb-4 text-xs">
            <div>
              <span className="text-[#D2B48C] block">Order Date</span>
              <span className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[#D2B48C] block">Payment Method</span>
              <span className="font-bold uppercase">{order.shipping.paymentMethod}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-[#D2B48C]">Order Summary</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl bg-[#1C100B]" />
                  <div>
                    <p className="font-bold text-[#FDFBF7]">{item.name}</p>
                    <p className="text-[#D2B48C]">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-[#FDFBF7]">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Address & Total */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#3E2723]/80 text-xs">
            <div>
              <span className="text-[#D2B48C] block font-bold mb-1">Shipping To</span>
              <p className="text-[#FDFBF7] font-semibold">{order.shipping.fullName}</p>
              <p className="text-[#D2B48C]">{order.shipping.address}</p>
              <p className="text-[#D2B48C]">{order.shipping.city}, {order.shipping.zipCode}</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[#D2B48C] block font-bold mb-1">Total Paid</span>
              <span className="text-2xl font-bold text-[#E67E22]">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            to="/products"
            className="px-6 py-3 rounded-xl bg-[#3E2723]/60 border border-[#C87D55]/30 hover:bg-[#3E2723] text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[#FDFBF7]"
          >
            <FiPackage /> Continue Shopping
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-[#E67E22] text-[#1C100B] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#C87D55] transition-colors"
          >
            <FiHome /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationPage;