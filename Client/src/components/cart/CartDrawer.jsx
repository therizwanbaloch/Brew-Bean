import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CartDrawer = () => {
  // Fixed destructuring: cartItems instead of cart, subtotal instead of cartSubtotal
  const { 
    isCartOpen, 
    closeCart, 
    cartItems = [], 
    updateQuantity, 
    removeFromCart, 
    subtotal = 0, 
    cartCount = 0 
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1C100B] border-l border-[#3E2723] text-[#FDFBF7] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#3E2723] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#C87D55]/20 border border-[#C87D55]/30 text-[#E67E22]">
                <FiShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">Your Cart</h2>
                <p className="text-xs text-[#D2B48C]/70">{cartCount} {cartCount === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button 
              onClick={closeCart} 
              className="p-2 rounded-xl text-[#D2B48C] hover:text-[#FDFBF7] hover:bg-[#3E2723]/50 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-full bg-[#3E2723]/30 border border-[#3E2723] flex items-center justify-center text-[#D2B48C]/40">
                  <FiShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#D2B48C]">Your cart is empty</h3>
                  <p className="text-xs text-[#D2B48C]/60 mt-1 max-w-[200px]">Add your favorite fresh brew to get started.</p>
                </div>
              </div>
            ) : (
              cartItems.map((item, idx) => {
                // Safely extract product data whether populated from backend or stored locally
                const prod = item.product || item;
                const itemId = prod._id || item.productId || idx;
                const itemName = prod.name || item.name || 'Coffee Item';
                const itemImage = prod.images?.[0] || prod.image || item.image || 'https://via.placeholder.com/100?text=Coffee';
                const itemPrice = item.price || prod.price || 0;

                return (
                  <div 
                    key={`${itemId}-${item.size}-${idx}`}
                    className="p-4 rounded-2xl bg-[#3E2723]/20 border border-[#3E2723]/60 flex gap-4 items-center group hover:border-[#C87D55]/40 transition-colors"
                  >
                    <img 
                      src={itemImage} 
                      alt={itemName} 
                      className="w-16 h-16 rounded-xl object-cover bg-[#1C100B] border border-[#3E2723]"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-sm text-[#FDFBF7] truncate">{itemName}</h4>
                      <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-medium bg-[#3E2723]/60 text-[#D2B48C]">
                        Size: {item.size || 'Regular'}
                      </span>
                      <div className="mt-2 text-sm font-bold text-[#E67E22]">
                        PKR {Number(itemPrice).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <button 
                        onClick={() => removeFromCart(itemId)}
                        className="text-[#D2B48C]/50 hover:text-red-400 transition-colors"
                        title="Remove Item"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 bg-[#1C100B] border border-[#3E2723] rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(itemId, item.quantity - 1)} 
                          className="p-1 hover:text-[#E67E22]"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(itemId, item.quantity + 1)} 
                          className="p-1 hover:text-[#E67E22]"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#3E2723] bg-[#1C100B]/95 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#D2B48C]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#FDFBF7]">PKR {Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="border-t border-[#3E2723] pt-2 flex justify-between text-base font-bold text-[#FDFBF7]">
                  <span>Total</span>
                  <span className="text-[#E67E22]">PKR {Number(subtotal).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E67E22] to-[#C87D55] text-[#1C100B] font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{user ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;