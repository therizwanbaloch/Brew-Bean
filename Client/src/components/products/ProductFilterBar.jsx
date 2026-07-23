import React from 'react';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineRefresh } from 'react-icons/hi';

export default function ProductFilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  keyword,
  onKeywordChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyFilter,
  onReset
}) {
  return (
    <div className="bg-amber-900/30 border border-amber-800/50 rounded-2xl p-5 mb-8 space-y-5">
      {/* Search Input & Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search coffee by name..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="w-full bg-amber-950/80 text-amber-100 placeholder-amber-400/60 px-4 py-2.5 pl-10 rounded-xl border border-amber-800 focus:outline-none focus:border-amber-500 text-sm"
          />
          <HiOutlineSearch className="absolute left-3 top-3 text-amber-400 w-4 h-4" />
        </div>

        {/* Price Inputs & Apply Button */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <span>PKR</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-20 bg-amber-950/80 text-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-800 text-sm focus:outline-none focus:border-amber-500"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-20 bg-amber-950/80 text-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-800 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={onApplyFilter}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow"
          >
            <HiOutlineFilter className="w-4 h-4" />
            Filter
          </button>

          <button
            onClick={onReset}
            className="p-2 bg-amber-900/60 text-amber-300 hover:text-amber-100 rounded-xl border border-amber-800 transition"
            title="Reset Filters"
          >
            <HiOutlineRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectCategory('')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            selectedCategory === ''
              ? 'bg-amber-500 text-amber-950 shadow-md'
              : 'bg-amber-900/50 text-amber-200 border border-amber-800/60 hover:bg-amber-800/80'
          }`}
        >
          All Coffee
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat._id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat._id
                ? 'bg-amber-500 text-amber-950 shadow-md'
                : 'bg-amber-900/50 text-amber-200 border border-amber-800/60 hover:bg-amber-800/80'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}