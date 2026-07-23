import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FaCoffee, 
  FaSpinner, 
  FaExclamationCircle, 
  FaRedo 
} from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';
import ProductCard from '../components/products/ProductCard';
import ProductFilterBar from '../components/products/ProductFilterBar';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // 1. Fetch Categories for the Filter Bar
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(ENDPOINTS.CATEGORIES);
        // Backend pattern: { success: true, categories: [...] } or direct array fallback
        if (isMounted) {
          const categoryList = res.data?.categories || res.data || [];
          setCategories(Array.isArray(categoryList) ? categoryList : []);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch Products according to query/filter params
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = ENDPOINTS.PRODUCTS;
      const params = new URLSearchParams();

      // Build active search params to mirror backend filter expectations
      if (selectedCategory) params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      if (params.toString()) {
        endpoint = `/products/filter?${params.toString()}`;
      } else if (keyword.trim()) {
        endpoint = `${ENDPOINTS.SEARCH_PRODUCTS}?keyword=${encodeURIComponent(keyword.trim())}`;
      }

      const res = await axiosInstance.get(endpoint);
      
      // Standard response check: { success: true, products: [...] } or fallback to raw array
      const productList = res.data?.products || (Array.isArray(res.data) ? res.data : []);
      setProducts(productList);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.response?.data?.message || "Failed to load menu items.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, minPrice, maxPrice, keyword]);

  // Sync products on category filter update
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Manual Apply Filter
  const handleApplyFilter = () => {
    // Update URL Search Parameters
    const newParams = {};
    if (keyword) newParams.search = keyword;
    if (selectedCategory) newParams.category = selectedCategory;
    if (minPrice) newParams.minPrice = minPrice;
    if (maxPrice) newParams.maxPrice = maxPrice;
    
    setSearchParams(newParams);
    fetchProducts();
  };

  // Reset Filters
  const handleReset = () => {
    setKeyword('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
    
    setLoading(true);
    axiosInstance.get(ENDPOINTS.PRODUCTS)
      .then((res) => {
        const productList = res.data?.products || (Array.isArray(res.data) ? res.data : []);
        setProducts(productList);
      })
      .catch((err) => {
        console.error("Failed to reset products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-amber-950 min-h-screen text-amber-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex items-center justify-between border-b border-amber-900/60 pb-6">
          <div>
            <h1 className="text-3xl font-black font-serif text-amber-100 flex items-center gap-3">
              <FaCoffee className="text-amber-500 w-8 h-8" />
              Our Coffee Menu
            </h1>
            <p className="text-amber-300/70 text-sm mt-1">
              Choose your preferred roast, select customizations, and order freshly prepared drinks.
            </p>
          </div>
        </header>

        {/* Search & Filter Toolbar */}
        <ProductFilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
          keyword={keyword}
          onKeywordChange={setKeyword}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onApplyFilter={handleApplyFilter}
          onReset={handleReset}
        />

        {/* State Views: Loading, Error, Empty, and Grid */}
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center text-amber-300 gap-3">
            <FaSpinner className="w-8 h-8 animate-spin text-amber-500" />
            <span className="font-bold text-sm tracking-wide">Brewing your menu...</span>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-800/50 rounded-2xl p-8 text-center my-8 flex flex-col items-center">
            <FaExclamationCircle className="w-10 h-10 text-red-400 mb-3" />
            <h3 className="text-base font-bold text-red-200">{error}</h3>
            <button
              onClick={fetchProducts}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-900/60 hover:bg-red-800 text-red-100 text-xs font-bold rounded-xl transition"
            >
              <FaRedo className="w-3 h-3" /> Retry Loading
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-amber-900/20 border border-amber-800/40 rounded-2xl p-12 text-center my-8 flex flex-col items-center">
            <div className="p-4 bg-amber-950/80 rounded-full border border-amber-800/60 mb-3">
              <FaCoffee className="w-8 h-8 text-amber-500/70" />
            </div>
            <h3 className="text-lg font-bold text-amber-200">No drinks match your criteria</h3>
            <p className="text-amber-400/70 text-xs mt-1 max-w-sm">
              We couldn't find any items matching your selected category or price filters.
            </p>
            <button
              onClick={handleReset}
              className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-amber-950 text-xs font-bold rounded-xl transition shadow-md"
            >
              <FaRedo className="w-3 h-3" /> Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}