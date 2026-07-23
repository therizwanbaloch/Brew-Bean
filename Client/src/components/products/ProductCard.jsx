import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingBag, FiCheck, FiLoader, FiSliders } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  // Safe Price Calculation
  const rawPrice = 
    typeof product.price === 'number' 
      ? product.price 
      : product.sizes?.[0]?.price ?? product.basePrice ?? 0;

  const formattedPrice = Number(rawPrice).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const productId = product._id || product.id || '';
  const productSlug = product.slug || productId;
  const productImage = product.image || product.images?.[0] || 'https://via.placeholder.com/300?text=Coffee';
  const ratingValue = product.rating ?? product.averageRating ?? 0;
  
  // Check if product has optional customizations or multiple sizes
  const hasCustomizations = (product.sizes && product.sizes.length > 1) || (product.customizations && product.customizations.length > 0);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId || adding) return;

    try {
      setAdding(true);

      // Unified Cart Payload Structure
      const payload = {
        productId: productId,
        size: product.sizes?.[0]?.name || 'Regular',
        customizations: [],
        quantity: 1
      };

      await addToCart(payload);
      
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-[#3E2723]/20 border border-[#3E2723]/70 rounded-3xl overflow-hidden hover:border-[#C87D55]/60 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
      <div>
        {/* Product Image Zone */}
        <div className="relative aspect-square overflow-hidden bg-[#1C100B]">
          <img 
            src={productImage} 
            alt={product.name || 'Coffee Item'} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C100B] via-transparent to-transparent opacity-60" />
          
          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.tags?.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C100B]/80 backdrop-blur-md text-[#E67E22] border border-[#E67E22]/30">
                {tag}
              </span>
            ))}
          </div>

          {/* Roast Level */}
          {product.roastLevel && (
            <div className="absolute bottom-3 left-3 text-xs font-semibold text-[#D2B48C] bg-[#1C100B]/90 px-3 py-1 rounded-lg border border-[#3E2723]">
              {product.roastLevel} Roast
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#D2B48C]">
            <span>{product.origin || product.category?.name || 'Fresh Brew'}</span>
            <div className="flex items-center gap-1 text-[#E67E22]">
              <FiStar className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-[#FDFBF7]">{ratingValue}</span>
            </div>
          </div>

          <Link to={`/products/${productSlug}`} className="block group-hover:text-[#E67E22] transition-colors">
            <h3 className="font-serif text-lg font-bold text-[#FDFBF7] line-clamp-1">{product.name || 'Coffee'}</h3>
          </Link>
        </div>
      </div>

      {/* Card Footer: Price & Actions */}
      <div className="p-5 pt-0 flex items-center justify-between mt-2 gap-2">
        <div>
          <span className="text-xs text-[#D2B48C]/60 block">Price</span>
          <span className="text-lg font-bold text-[#FDFBF7]">PKR {formattedPrice}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Customization Redirect Button */}
          <button
            type="button"
            onClick={() => navigate(`/products/${productSlug}`)}
            className="p-3 rounded-xl border border-[#3E2723] bg-[#1C100B]/60 text-[#D2B48C] hover:text-[#E67E22] hover:border-[#E67E22]/50 transition-all duration-300"
            title={hasCustomizations ? "Customize Drink" : "View Details"}
            aria-label="Customize item"
          >
            <FiSliders className="w-5 h-5" />
          </button>

          {/* Direct Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-center ${
              added
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-[#C87D55]/20 hover:bg-[#E67E22] text-[#E67E22] hover:text-[#1C100B] border-[#C87D55]/40'
            }`}
            title="Quick Add to Cart"
            aria-label="Add to Cart"
          >
            {adding ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : added ? (
              <FiCheck className="w-5 h-5" />
            ) : (
              <FiShoppingBag className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;