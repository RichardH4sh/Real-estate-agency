import React from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyType } from '../types';
import { Search, SlidersHorizontal, RotateCcw, Building, Home, MapPin, LandPlot, Sparkles } from 'lucide-react';

interface PropertyFiltersProps {
  totalCount: number;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({ totalCount }) => {
  const { filters, updateFilter, resetFilters, properties } = useRealEstate();

  // Extract unique cities
  const uniqueCities = Array.from(new Set(properties.map(p => p.location.city))).sort();

  const propertyTypes: { id: 'all' | PropertyType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All Real Estate', icon: Sparkles },
    { id: 'flat', label: 'Flats & Apts', icon: Building },
    { id: 'house', label: 'Houses & Villas', icon: Home },
    { id: 'land', label: 'Land & Plots', icon: LandPlot },
  ];

  const bedroomOptions: { value: number | 'all'; label: string }[] = [
    { value: 'all', label: 'Any Beds' },
    { value: 1, label: '1+ Bed' },
    { value: 2, label: '2+ Beds' },
    { value: 3, label: '3+ Beds' },
    { value: 4, label: '4+ Beds' },
    { value: 5, label: '5+ Beds' },
  ];

  return (
    <div id="property-filters-panel" className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-5">
      {/* Top Search & Filter Title */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-amber-700" />
          <h2 className="text-base font-semibold text-stone-900">Refine Properties</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            {totalCount} {totalCount === 1 ? 'Listing' : 'Listings'} Found
          </span>
        </div>

        <button
          id="reset-filters-btn"
          type="button"
          onClick={resetFilters}
          className="flex items-center justify-center gap-1.5 text-xs text-stone-500 hover:text-amber-800 transition-colors font-medium py-1 px-2.5 rounded-lg hover:bg-stone-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      </div>

      {/* Property Type Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {propertyTypes.map(type => {
          const Icon = type.icon;
          const isSelected = filters.type === type.id;
          return (
            <button
              key={type.id}
              id={`filter-type-${type.id}`}
              type="button"
              onClick={() => updateFilter('type', type.id)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-500/20'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Inputs Grid: Search, City, Bedrooms, Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Keyword Search */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
            Search Keywords
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-keywords-input"
              type="text"
              placeholder="e.g. Marina, Penthouse, Pool..."
              value={filters.searchQuery}
              onChange={e => updateFilter('searchQuery', e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Location / City Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
            Location / Region
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="filter-city-select"
              value={filters.city}
              onChange={e => updateFilter('city', e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-8 py-2 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            >
              <option value="all">All Cities & Regions</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Number of Bedrooms */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
            Bedrooms
          </label>
          <select
            id="filter-bedrooms-select"
            value={filters.bedrooms}
            onChange={e => {
              const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
              updateFilter('bedrooms', val);
            }}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          >
            {bedroomOptions.map(opt => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
            Sort Order
          </label>
          <select
            id="sort-by-select"
            value={filters.sortBy}
            onChange={e => updateFilter('sortBy', e.target.value as any)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          >
            <option value="featured">Featured & Curated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Listings</option>
            <option value="area-desc">Largest Space / Acreage</option>
          </select>
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Price Ceiling:
          </span>
          <span className="text-sm font-bold text-amber-700">
            {filters.maxPrice >= 10000000
              ? 'Any Price ($10M+)'
              : `Up to $${(filters.maxPrice / 1000000).toFixed(1)}M`}
          </span>
        </div>

        <div className="flex-1 max-w-lg flex items-center gap-3">
          <span className="text-xs text-stone-400 font-medium">$500k</span>
          <input
            id="price-range-slider"
            type="range"
            min={500000}
            max={10000000}
            step={250000}
            value={filters.maxPrice}
            onChange={e => updateFilter('maxPrice', Number(e.target.value))}
            className="w-full accent-amber-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
          />
          <span className="text-xs text-stone-400 font-medium">$10M+</span>
        </div>
      </div>
    </div>
  );
};
