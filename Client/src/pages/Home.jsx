import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCoffee, 
  FiArrowRight, 
  FiAward, 
  FiTruck, 
  FiSmile, 
  FiChevronRight,
  FiLoader,
  FiSun,
  FiZap,
  FiCheckCircle
} from 'react-icons/fi';
// Named import fix from services/api.js
import { fetchFeaturedProductsAPI, fetchProductsAPI } from '../services/api.js';

const Home = () => {
  const [featuredCoffees, setFeaturedCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        let productsList = [];

        // Try calling the dedicated featured endpoint first
        try {
          const featuredData = await fetchFeaturedProductsAPI();
          productsList = Array.isArray(featuredData) 
            ? featuredData 
            : featuredData.products || featuredData.featuredProducts || [];
        } catch {
          // Fallback to fetch all products and filter locally
          const data = await fetchProductsAPI();
          const allProducts = Array.isArray(data) ? data : data.products || [];
          const featured = allProducts.filter((item) => item.featured);
          productsList = featured.length > 0 ? featured : allProducts;
        }

        setFeaturedCoffees(productsList.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setError('Failed to load featured products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getDisplayPrice = (coffee) => {
    if (coffee.sizes && coffee.sizes.length > 0) {
      const prices = coffee.sizes.map((s) => s.price);
      return `Rs. ${Math.min(...prices)}`;
    }
    return coffee.price ? `Rs. ${coffee.price}` : 'Rs. 0';
  };

  const perks = [
    {
      icon: <FiCoffee className="w-6 h-6 text-[#E67E22]" />,
      title: 'Ethically Sourced',
      desc: '100% single-origin Arabica beans sourced directly from fair-trade micro-farms worldwide.',
    },
    {
      icon: <FiAward className="w-6 h-6 text-[#E67E22]" />,
      title: 'Master Roasted',
      desc: 'Small-batch roasted daily in-house to lock in peak aroma, acidity, and rich flavor notes.',
    },
    {
      icon: <FiTruck className="w-6 h-6 text-[#E67E22]" />,
      title: 'Express Delivery',
      desc: 'Freshly sealed and shipped within 24 hours of roasting directly to your doorstep.',
    },
    {
      icon: <FiSmile className="w-6 h-6 text-[#E67E22]" />,
      title: 'Guaranteed Fresh',
      desc: 'If your roast isn’t at peak perfection, we’ll replace your bag—no questions asked.',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Ethical Sourcing',
      desc: 'We hand-select specialty Arabica beans directly from sustainable micro-lots around the globe.',
      icon: <FiSun className="w-6 h-6 text-[#E67E22]" />
    },
    {
      step: '02',
      title: 'Precision Roasting',
      desc: 'Roasted in small batches using custom heat profiles to extract optimal origin notes.',
      icon: <FiZap className="w-6 h-6 text-[#E67E22]" />
    },
    {
      step: '03',
      title: 'Artisanal Extraction',
      desc: 'Brewed to precise ratios by certified baristas to ensure smooth crema and rich body.',
      icon: <FiCoffee className="w-6 h-6 text-[#E67E22]" />
    },
    {
      step: '04',
      title: 'Fresh Delivery',
      desc: 'Sealed immediately into nitrogen-flushed packaging and served hot or shipped fresh.',
      icon: <FiCheckCircle className="w-6 h-6 text-[#E67E22]" />
    }
  ];

  const topHeroCoffee = featuredCoffees[0];

  return (
    <div className="bg-[#1C100B] text-[#FDFBF7] min-h-screen selection:bg-[#E67E22] selection:text-[#1C100B]">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-32 border-b border-[#3E2723]/60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E67E22]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-[#C87D55]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3E2723]/50 border border-[#C87D55]/30 text-[#D2B48C] text-xs font-semibold uppercase tracking-widest shadow-sm">
                <FiCoffee className="text-[#E67E22]" />
                Freshly Roasted Artisanal Coffee
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FDFBF7] leading-[1.15] tracking-tight">
                Crafted for those who <br className="hidden sm:inline" />
                revere <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E67E22] via-[#D2B48C] to-[#C87D55]">every single sip.</span>
              </h1>

              <p className="text-[#D2B48C]/90 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover small-batch roasts and specialty drinks prepared to perfection. Delivered fresh from our café directly to your door.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#C87D55] to-[#A0522D] hover:from-[#E67E22] hover:to-[#C87D55] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#C87D55]/25 hover:shadow-[#E67E22]/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                >
                  Explore Our Menu
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/about"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#3E2723]/40 border border-[#3E2723] hover:border-[#C87D55]/50 text-[#FDFBF7] hover:text-[#E67E22] font-semibold text-sm uppercase tracking-wider transition-all duration-300 text-center"
                >
                  Read Our Story
                </Link>
              </div>

              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-[#3E2723]/60 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <p className="font-serif text-2xl lg:text-3xl font-bold text-[#E67E22]">100%</p>
                  <p className="text-xs text-[#D2B48C]/80 uppercase tracking-wider font-medium mt-1">Authentic Taste</p>
                </div>
                <div>
                  <p className="font-serif text-2xl lg:text-3xl font-bold text-[#E67E22]">15 Mins</p>
                  <p className="text-xs text-[#D2B48C]/80 uppercase tracking-wider font-medium mt-1">Avg Prep Time</p>
                </div>
                <div>
                  <p className="font-serif text-2xl lg:text-3xl font-bold text-[#E67E22]">15k+</p>
                  <p className="text-xs text-[#D2B48C]/80 uppercase tracking-wider font-medium mt-1">Happy Drinkers</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#E67E22]/30 to-[#C87D55]/30 rounded-3xl blur-xl" />
                
                <div className="relative rounded-2xl overflow-hidden border border-[#C87D55]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                  <img
                    src={
                      topHeroCoffee?.images?.[0] ||
                      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80"
                    }
                    alt={topHeroCoffee?.name || "Craft Coffee"}
                    className="w-full h-[450px] lg:h-[520px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#1C100B]/85 backdrop-blur-md border border-[#3E2723] flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E67E22]/20 border border-[#E67E22]/40 flex items-center justify-center text-[#E67E22]">
                        <FiCoffee className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#FDFBF7]">Café Favorite</p>
                        <p className="text-[11px] text-[#D2B48C]">
                          {topHeroCoffee?.name || 'Spanish Latte'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-serif font-bold text-[#E67E22]">
                      {topHeroCoffee ? getDisplayPrice(topHeroCoffee) : 'Rs. 850'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PERKS / VALUES */}
      <section className="py-16 bg-[#180E09] border-b border-[#3E2723]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-[#3E2723]/20 border border-[#3E2723]/50 hover:border-[#C87D55]/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3E2723]/40 border border-[#3E2723] flex items-center justify-center mb-4 group-hover:bg-[#E67E22]/10 transition-colors">
                  {perk.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FDFBF7] mb-2">{perk.title}</h3>
                <p className="text-xs text-[#D2B48C]/80 leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-semibold">Popular Picks</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7] mt-2">Featured Drinks & Treats</h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#D2B48C] hover:text-[#E67E22] transition-colors group"
            >
              View Full Menu
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#D2B48C]">
              <FiLoader className="w-8 h-8 animate-spin text-[#E67E22]" />
              <p className="text-xs uppercase tracking-wider font-semibold">Loading menu items...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-[#E67E22] text-sm">
              {error}
            </div>
          ) : featuredCoffees.length === 0 ? (
            <div className="text-center py-12 text-[#D2B48C]/70 text-sm">
              No products currently available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCoffees.map((product) => {
                const productId = product._id;
                const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80';
                const categoryName = product.category?.name || 'Specialty';

                return (
                  <div
                    key={productId}
                    className="rounded-2xl bg-[#3E2723]/20 border border-[#3E2723]/60 overflow-hidden hover:border-[#C87D55]/50 transition-all duration-300 group flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden bg-[#1C100B]">
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-[#1C100B]/80 backdrop-blur-md border border-[#C87D55]/40 text-[#E67E22] text-[10px] uppercase tracking-wider font-bold">
                            Bestseller
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[11px] font-medium text-[#C87D55] uppercase tracking-wider">
                          {categoryName}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-[#FDFBF7] mt-1 group-hover:text-[#E67E22] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#D2B48C]/70 mt-2 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#3E2723]/60 flex items-center justify-between">
                        <span className="font-serif text-lg font-bold text-[#FDFBF7]">
                          {getDisplayPrice(product)}
                        </span>
                        <Link
                          to={`/products/${product.slug || productId}`}
                          className="px-4 py-2 rounded-full bg-[#3E2723]/50 hover:bg-[#E67E22] text-[#FDFBF7] hover:text-[#1C100B] text-xs font-bold uppercase tracking-wider border border-[#3E2723] hover:border-[#E67E22] transition-all"
                        >
                          Order Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* HOW WE BREW / ROASTING PROCESS SECTION */}
      <section className="py-20 bg-[#180E09] border-t border-b border-[#3E2723]/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-semibold">Behind the Scenes</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7] mt-2">Our Craft Process</h2>
            <p className="text-xs sm:text-sm text-[#D2B48C]/80 mt-3">From raw green beans to the aromatic cup in your hand, precision is involved in every step.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-[#3E2723]/20 border border-[#3E2723]/50 hover:border-[#C87D55]/50 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#3E2723]/40 border border-[#3E2723] flex items-center justify-center group-hover:bg-[#E67E22]/10 transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-serif text-2xl font-black text-[#E67E22]/40 group-hover:text-[#E67E22] transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#FDFBF7] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#D2B48C]/80 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3E2723] via-[#2A1810] to-[#1C100B] p-10 sm:p-16 border border-[#C87D55]/30 shadow-2xl text-center">
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
                Ready to satisfy your cravings?
              </h2>
              <p className="text-xs sm:text-sm text-[#D2B48C]/90 leading-relaxed">
                Join our coffee club today. Create an account to place orders, track live status, and unlock member discounts.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#E67E22] hover:bg-[#C87D55] text-[#1C100B] font-bold text-xs uppercase tracking-wider shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Create Your Account
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;