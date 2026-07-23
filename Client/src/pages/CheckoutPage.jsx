import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiLocationMarker, HiCreditCard, HiArrowLeft } from 'react-icons/hi';
import API from '../services/api';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart, loading } = useCart();

  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress.trim()) {
      setErrorMessage('Please provide a complete shipping address.');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
      };

      const res = await API.post('/orders', payload);

      if (res.data?.success || res.status === 201 || res.status === 200) {
        await clearCart();
        navigate('/orders', {
          state: { newOrderCreated: true },
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to place order.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C100B] flex items-center justify-center text-[#D2B48C] font-bold">
        Preparing checkout...
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#1C100B] flex flex-col items-center justify-center text-[#FDFBF7] p-4">
        <h2 className="text-2xl font-bold font-serif mb-2">Your cart is empty</h2>
        <p className="text-[#D2B48C]/80 text-sm mb-6">Add some delicious brews before checking out.</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-[#E67E22] text-[#1C100B] font-bold rounded-xl hover:brightness-110 transition"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1C100B] min-h-screen text-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3E2723]/60 pb-5">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="flex items-center gap-2 text-sm text-[#D2B48C] hover:text-[#E67E22] transition"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold font-serif text-[#FDFBF7]">Checkout</h1>
          <div className="w-12" />
        </div>

        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-300 px-4 py-3 rounded-xl text-sm font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Form Fields Section */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-[#3E2723]/20 border border-[#3E2723]/60 rounded-2xl p-6 space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-[#E67E22] uppercase tracking-wider">
                <HiLocationMarker className="w-5 h-5" />
                Shipping Details
              </label>
              <div>
                <textarea
                  rows={3}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street address, apartment, city, area details..."
                  className="w-full bg-[#1C100B]/80 border border-[#3E2723] rounded-xl p-3 text-sm text-[#FDFBF7] placeholder-[#D2B48C]/40 focus:outline-none focus:border-[#E67E22] transition"
                />
              </div>
            </div>

            <div className="bg-[#3E2723]/20 border border-[#3E2723]/60 rounded-2xl p-6 space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-[#E67E22] uppercase tracking-wider">
                <HiCreditCard className="w-5 h-5" />
                Payment Method
              </label>
              
              <div className="space-y-3">
                {['Cash on Delivery', 'Online Payment'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition ${
                      paymentMethod === method
                        ? 'bg-[#3E2723]/80 border-[#E67E22] text-[#FDFBF7] font-semibold'
                        : 'bg-[#1C100B]/40 border-[#3E2723]/60 text-[#D2B48C]/70 hover:border-[#3E2723]'
                    }`}
                  >
                    <span>{method}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === method ? 'border-[#E67E22] bg-[#E67E22]' : 'border-[#3E2723]'
                      }`}
                    >
                      {paymentMethod === method && <span className="w-1.5 h-1.5 rounded-full bg-[#1C100B]" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#3E2723]/20 border border-[#3E2723]/60 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold font-serif text-[#FDFBF7]">Order Summary</h3>
              
              <div className="divide-y divide-[#3E2723]/40 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => {
                  const productName = item.product?.name || item.name || 'Item';
                  const itemPrice = item.price || item.product?.price || 0;

                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-[#FDFBF7]">{productName}</p>
                        <p className="text-[#D2B48C]/60">
                          Qty: {item.quantity} {item.size ? `| ${item.size}` : ''}
                        </p>
                      </div>
                      <span className="font-bold text-[#D2B48C]">
                        PKR {(itemPrice * (item.quantity || 1)).toLocaleString('en-PK')}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#3E2723]/60 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-[#D2B48C]">
                  <span>Subtotal</span>
                  <span>PKR {subtotal.toLocaleString('en-PK')}</span>
                </div>
                <div className="flex justify-between text-xs text-[#D2B48C]">
                  <span>Delivery</span>
                  <span className="text-emerald-400 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#E67E22] pt-2 border-t border-[#3E2723]/40">
                  <span>Total</span>
                  <span>PKR {subtotal.toLocaleString('en-PK')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#E67E22] to-[#C87D55] text-[#1C100B] font-black rounded-xl hover:brightness-110 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}