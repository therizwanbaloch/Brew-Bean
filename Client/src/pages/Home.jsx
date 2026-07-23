import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCoffee, 
  FiArrowRight, 
  FiAward, 
  FiTruck, 
  FiSmile, 
  FiStar, 
  FiHeart ,
  FiChevronRight
} from 'react-icons/fi';

const Home = () => {
  
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

  // Featured Coffees
  const featuredCoffees = [
    {
      id: '1',
      name: 'Velvet Espresso Reserve',
      roast: 'Dark Roast',
      notes: 'Dark Chocolate, Toasted Hazelnut, Caramel',
      price: '$18.50',
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '2',
      name: 'Ethiopian Yirgacheffe Bloom',
      roast: 'Light Roast',
      notes: 'Jasmine, Bergamot, Wild Berry',
      price: '$21.00',
      badge: 'Limited Edition',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '3',
      name: 'Highland Bourbon Santos',
      roast: 'Medium Roast',
      notes: 'Brown Sugar, Sweet Apple, Almond',
      price: '$19.00',
      badge: 'Barista Choice',
      image: 'https://images.unsplash.com/photo-1587080413959-06b859fb1c22?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Customer Reviews
  const reviews = [
    {
      name: 'Elena Rostova',
      role: 'Certified Sommelier',
      comment: 'Brew & Bean’s Ethiopian roast completely transformed my morning ritual. The floral notes are delicate, crisp, and unforgettable.',
      rating: 5,
    },
    {
      name: 'Marcus Vance',
      role: 'Coffee Enthusiast',
      comment: 'Hands down the freshest beans I’ve ever ordered online. Arrived two days after roasting, still off-gassing perfection.',
      rating: 5,
    },
    {
      name: 'Sophia Chen',
      role: 'Home Barista',
      comment: 'The Velvet Espresso creates a thick, golden crema every single shot. It’s now a permanent staple in my espresso bar.',
      rating: 5,
    },
  ];

  return (
    <div className="bg-[#1C100B] text-[#FDFBF7] min-h-screen selection:bg-[#E67E22] selection:text-[#1C100B]">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden py-20 lg:py-32 border-b border-[#3E2723]/60">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E67E22]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-[#C87D55]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Text */}
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
                Discover small-batch, single-origin roasts sourced from ethical high-altitude farms. Roasted daily in our atelier and delivered at peak flavor depth.
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

              {/* Quick Metrics */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-[#3E2723]/60 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <p className="font-serif text-2xl lg:text-3xl font-bold text-[#E67E22]">100%</p>
                  <p className="text-xs text-[#D2B48C]/80 uppercase tracking-wider font-medium mt-1">Arabica Beans</p>
                </div>
                <div>
                  <p className="font-serif text-2xl lg:text-3xl font-bold text-[#E67E22]">48 Hrs</p>
                  <p className="text-xs text-[#D2B48C]/80 uppercase tracking-wider font-medium mt-1">Roast-to-Door</p>
                </div>
                <div>
                  <p className="font-serif text-2xl lg:text-3xl font-bold text-[#E67E22]">15k+</p>
                  <p className="text-xs text-[#D2B48C]/80 uppercase tracking-wider font-medium mt-1">Coffee Lovers</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Frame Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#E67E22]/30 to-[#C87D55]/30 rounded-3xl blur-xl" />
                
                <div className="relative rounded-2xl overflow-hidden border border-[#C87D55]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                  <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80"
                    alt="Pour over coffee crafting"
                    className="w-full h-[450px] lg:h-[520px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#1C100B]/85 backdrop-blur-md border border-[#3E2723] flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E67E22]/20 border border-[#E67E22]/40 flex items-center justify-center text-[#E67E22]">
                        <FiHeart className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#FDFBF7]">Roaster's Choice</p>
                        <p className="text-[11px] text-[#D2B48C]">Ethiopian Yirgacheffe</p>
                      </div>
                    </div>
                    <span className="text-xs font-serif font-bold text-[#E67E22]">$21.00</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= PERKS / VALUES ================= */}
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

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-semibold">Curated Selection</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7] mt-2">Featured Roasts</h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#D2B48C] hover:text-[#E67E22] transition-colors group"
            >
              View Full Menu
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCoffees.map((coffee) => (
              <div
                key={coffee.id}
                className="rounded-2xl bg-[#3E2723]/20 border border-[#3E2723]/60 overflow-hidden hover:border-[#C87D55]/50 transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-64 overflow-hidden bg-[#1C100B]">
                  <img
                    src={coffee.image}
                    alt={coffee.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#1C100B]/80 backdrop-blur-md border border-[#C87D55]/40 text-[#E67E22] text-[10px] uppercase tracking-wider font-bold">
                      {coffee.badge}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-medium text-[#C87D55] uppercase tracking-wider">{coffee.roast}</span>
                    <h3 className="font-serif text-xl font-bold text-[#FDFBF7] mt-1 group-hover:text-[#E67E22] transition-colors">
                      {coffee.name}
                    </h3>
                    <p className="text-xs text-[#D2B48C]/70 mt-2 line-clamp-2">
                      <span className="font-semibold text-[#D2B48C]">Notes:</span> {coffee.notes}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#3E2723]/60 flex items-center justify-between">
                    <span className="font-serif text-xl font-bold text-[#FDFBF7]">{coffee.price}</span>
                    <Link
                      to={`/products/${coffee.id}`}
                      className="px-4 py-2 rounded-full bg-[#3E2723]/50 hover:bg-[#E67E22] text-[#FDFBF7] hover:text-[#1C100B] text-xs font-bold uppercase tracking-wider border border-[#3E2723] hover:border-[#E67E22] transition-all"
                    >
                      View Roast
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 bg-[#180E09] border-t border-b border-[#3E2723]/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-semibold">Real Feedback</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7] mt-2">Loved by Connoisseurs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-[#3E2723]/20 border border-[#3E2723]/50 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-[#E67E22]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#D2B48C]/90 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#3E2723]/40">
                  <p className="font-serif text-sm font-bold text-[#FDFBF7]">{rev.name}</p>
                  <p className="text-[11px] text-[#C87D55]">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3E2723] via-[#2A1810] to-[#1C100B] p-10 sm:p-16 border border-[#C87D55]/30 shadow-2xl text-center">
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
                Ready to elevate your morning cup?
              </h2>
              <p className="text-xs sm:text-sm text-[#D2B48C]/90 leading-relaxed">
                Join our coffee community today. Create an account to receive 15% off your first order and access subscriber-only single-origin micro-lots.
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