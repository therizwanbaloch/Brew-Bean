import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiArrowRight, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, shippingFee, grandTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#1C100B] text-[#FDFBF7] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#3E2723]/30 border border-[#3E2723] flex items-center justify-center text-[#E67E22]">
          <FiShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold">Your Cart is Currently Empty</h1>
        <p className="text-xs text-[#D2B48C] max-w-sm">Looks like you haven't added any coffee beans to your order yet.</p>
        <Link
          to="/products"
          className="mt-4 px-6 py-3 rounded-xl bg-[#E67E22] text-[#1C100B] font-bold text-xs uppercase tracking-wider hover:bg-[#C87D55] transition-colors"
        >
          Explore Roasts
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C100B] text-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between border-b border-[#3E2723]/80 pb-6">
          <h1 className="font-serif text-3xl font-bold">Shopping Cart</h1>
          <button onClick={clearCart} className="text-xs text-red-400 hover:underline">
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#3E2723]/20 border border-[#3E2723]/70 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-[#1C100B]" />
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold">{item.name}</h3>
                    <p className="text-xs text-[#D2B48C]">{item.origin} • {item.roastLevel} Roast</p>
                    <span className="text-xs font-semibold text-[#E67E22]">${item.price.toFixed(2)} each</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 border-[#3E2723]/60 pt-3 sm:pt-0">
                  <div className="flex items-center border border-[#3E2723] bg-[#1C100B] rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-xs text-[#D2B48C] hover:bg-[#3E2723]"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-xs text-[#D2B48C] hover:bg-[#3E2723]"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-base font-bold sm:w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <Link to="/products" className="inline-flex items-center gap-2 text-xs text-[#D2B48C] hover:text-[#E67E22] pt-4">
              <FiArrowLeft /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary Box */}
          <div className="bg-[#3E2723]/25 border border-[#3E2723]/80 p-6 rounded-3xl space-y-6 h-fit">
            <h2 className="font-serif text-lg font-bold border-b border-[#3E2723]/80 pb-4">Order Summary</h2>

            <div className="space-y-3 text-xs text-[#D2B48C]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#FDFBF7] font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="pt-3 border-t border-[#3E2723]/60 flex justify-between text-sm text-[#FDFBF7] font-bold">
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C87D55] to-[#A0522D] hover:from-[#E67E22] hover:to-[#C87D55] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <FiArrowRight />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;