import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiStar, HiClock, HiOutlineShoppingBag, HiCheckCircle } from 'react-icons/hi';
import { fetchProductBySlugAPI, fetchReviewsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ReviewList from '../components/reviews/ReviewList';
import AddReviewForm from '../components/reviews/AddReviewForm';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadReviews = async (productId) => {
    try {
      const data = await fetchReviewsAPI(productId);
      if (data?.success) {
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error('Failed to load reviews:', e);
      setReviews([]);
    }
  };

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchProductBySlugAPI(slug);

        if (data.success || data.product) {
          const fetchedProduct = data.product || data;
          setProduct(fetchedProduct);

          if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
            setSelectedSize(fetchedProduct.sizes[0]);
          } else {
            setSelectedSize({
              name: 'Regular',
              price: fetchedProduct.price || fetchedProduct.basePrice || 0,
            });
          }

          if (fetchedProduct._id) {
            await loadReviews(fetchedProduct._id);
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [slug]);

  const refreshReviews = async () => {
    if (!product?._id) return;
    await loadReviews(product._id);
  };

  const handleCustomizationToggle = (custom) => {
    const exists = selectedCustomizations.find((c) => c.name === custom.name);
    if (exists) {
      setSelectedCustomizations(selectedCustomizations.filter((c) => c.name !== custom.name));
    } else {
      setSelectedCustomizations([...selectedCustomizations, custom]);
    }
  };

  const calculateUnitPrice = () => {
    if (!product) return 0;
    const basePrice = selectedSize ? selectedSize.price : product.price || product.basePrice || 0;
    const customizationTotal = selectedCustomizations.reduce((acc, curr) => acc + (curr.price || 0), 0);
    return basePrice + customizationTotal;
  };

  const unitPrice = calculateUnitPrice();
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = async () => {
    if (!product || !product._id) {
      setErrorMessage('Product details unavailable.');
      return;
    }

    const finalSizeName = selectedSize?.name || product.sizes?.[0]?.name || 'Regular';

    setAddingToCart(true);
    setErrorMessage('');
    setSuccessMessage('');

    const cartPayload = {
      productId: product._id,
      size: finalSizeName,
      customizations: selectedCustomizations.map((c) => (typeof c === 'object' ? c.name : c)),
      quantity: Number(quantity) || 1,
    };

    try {
      await addToCart(cartPayload);
      setSuccessMessage('Item added to cart successfully!');
      if (openCart) openCart();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to add item to cart.';
      setErrorMessage(msg);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C100B] flex items-center justify-center text-[#D2B48C] font-bold">
        Preparing menu details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#1C100B] flex flex-col items-center justify-center text-[#FDFBF7] p-4">
        <h2 className="text-xl font-bold">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-5 py-2.5 bg-[#E67E22] text-[#1C100B] font-bold rounded-xl hover:brightness-110 transition"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1C100B] min-h-screen text-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#3E2723]/20 border border-[#3E2723]/60 rounded-3xl p-6 sm:p-8">
          <div className="space-y-4">
            <div className="aspect-square bg-[#1C100B] rounded-2xl overflow-hidden border border-[#3E2723]">
              <img
                src={product.images?.[0] || product.image || 'https://via.placeholder.com/500?text=Coffee'}
                alt={product.name || 'Coffee'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-[#E67E22] text-xs font-semibold uppercase tracking-wider mb-2">
                <span>{product.category?.name || 'Artisanal Roastery'}</span>
                <div className="flex items-center gap-1 bg-[#3E2723]/60 px-2.5 py-1 rounded-full border border-[#3E2723]">
                  <HiStar className="w-4 h-4 text-[#E67E22] fill-[#E67E22]" />
                  <span className="text-[#FDFBF7] font-bold">{product.averageRating || 0}</span>
                  <span className="text-[#D2B48C]/60">({product.totalReviews || reviews.length || 0})</span>
                </div>
              </div>

              <h1 className="text-3xl font-black font-serif text-[#FDFBF7]">{product.name}</h1>
              <p className="text-[#D2B48C]/80 text-sm mt-2 leading-relaxed">{product.description}</p>

              {product.preparationTime && (
                <div className="flex items-center gap-1.5 text-xs text-[#E67E22] mt-3 font-medium">
                  <HiClock className="w-4 h-4" />
                  <span>Prep time: ~{product.preparationTime} mins</span>
                </div>
              )}

              <hr className="border-[#3E2723]/60 my-6" />

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 mb-6">
                  <label className="text-xs uppercase tracking-wider text-[#D2B48C] font-bold block">
                    1. Select Size:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size.name}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                          selectedSize?.name === size.name
                            ? 'bg-[#E67E22] text-[#1C100B] border-[#E67E22] font-bold shadow-md'
                            : 'bg-[#1C100B]/60 border-[#3E2723] text-[#D2B48C] hover:border-[#C87D55]'
                        }`}
                      >
                        <span className="text-sm">{size.name}</span>
                        <span className="text-xs opacity-80">PKR {size.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customizations */}
              {product.customizations && product.customizations.length > 0 && (
                <div className="space-y-2 mb-6">
                  <label className="text-xs uppercase tracking-wider text-[#D2B48C] font-bold block">
                    2. Optional Add-ons:
                  </label>
                  <div className="space-y-2">
                    {product.customizations.map((custom) => {
                      const isChecked = !!selectedCustomizations.find((c) => c.name === custom.name);
                      return (
                        <button
                          key={custom.name}
                          type="button"
                          onClick={() => handleCustomizationToggle(custom)}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-sm transition ${
                            isChecked
                              ? 'bg-[#3E2723]/80 border-[#E67E22] text-[#FDFBF7]'
                              : 'bg-[#1C100B]/40 border-[#3E2723]/60 text-[#D2B48C] hover:border-[#3E2723]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center border text-xs ${
                                isChecked
                                  ? 'bg-[#E67E22] border-[#E67E22] text-[#1C100B] font-bold'
                                  : 'border-[#3E2723]'
                              }`}
                            >
                              {isChecked && '✓'}
                            </span>
                            {custom.name}
                          </span>
                          <span className="font-semibold text-[#E67E22]">+PKR {custom.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-wider text-[#D2B48C] font-bold">
                  Quantity:
                </span>
                <div className="flex items-center bg-[#1C100B] border border-[#3E2723] rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-[#D2B48C] hover:bg-[#3E2723] transition font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold text-[#FDFBF7]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-[#D2B48C] hover:bg-[#3E2723] transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total Price & Add to Cart */}
            <div className="space-y-3 pt-4 border-t border-[#3E2723]/60">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#D2B48C] font-medium uppercase tracking-wider">Total Price</span>
                <span className="text-2xl font-black text-[#E67E22]">PKR {totalPrice.toLocaleString('en-PK')}</span>
              </div>

              {errorMessage && (
                <div className="bg-rose-950/80 border border-rose-800 text-rose-300 px-4 py-2 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-4 py-2 rounded-xl text-xs font-semibold">
                  <HiCheckCircle className="w-5 h-5 text-emerald-400" />
                  {successMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart || product.isAvailable === false}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                  product.isAvailable !== false
                    ? 'bg-gradient-to-r from-[#E67E22] to-[#C87D55] hover:brightness-110 text-[#1C100B]'
                    : 'bg-[#3E2723]/50 text-[#D2B48C]/50 cursor-not-allowed border border-[#3E2723]'
                }`}
              >
                <HiOutlineShoppingBag className="w-5 h-5" />
                {addingToCart ? 'Adding to Cart...' : product.isAvailable !== false ? 'Add to Cart' : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="space-y-6 pt-6">
          <h2 className="text-2xl font-bold font-serif text-[#FDFBF7]">Customer Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <AddReviewForm productId={product._id} onReviewAdded={refreshReviews} />
            </div>
            <div className="lg:col-span-2">
              <ReviewList reviews={reviews} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}