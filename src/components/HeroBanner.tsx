import React from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyType } from '../types';
import { Search, MapPin, Building, Home, LandPlot, Sparkles, ShieldCheck, Award, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onSearchClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSearchClick }) => {
  const { companyInfo, filters, updateFilter, properties } = useRealEstate();

  const cities = Array.from(new Set(properties.map(p => p.location.city))).sort();

  return (
    <div className="relative overflow-hidden bg-stone-900 text-white py-12 sm:py-20">
      {/* Background Architectural Photo with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury architectural residence"
          className="w-full h-full object-cover object-center opacity-30 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Eyebrow & Main Title */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Flats &bull; Luxury Houses &bull; Prime Lands</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif-title leading-[1.15]">
            Discover Your Next <span className="text-amber-400 italic">Sanctuary</span> or Prime Investment.
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            {companyInfo.slogan}. Explore curated listings with high-resolution photo galleries, interactive neighborhood maps, and seamless VIP tour bookings.
          </p>
        </div>

        {/* E-Commerce Search & Filter Command Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/20 text-stone-900 max-w-4xl">
          {/* Property Type Radio Pills */}
          <div className="flex items-center gap-2 pb-3 border-b border-stone-200/80 overflow-x-auto scrollbar-none text-xs font-semibold">
            {[
              { id: 'all', label: 'All Real Estate', icon: Sparkles },
              { id: 'flat', label: 'Flats & Apartments', icon: Building },
              { id: 'house', label: 'Houses & Villas', icon: Home },
              { id: 'land', label: 'Lands & Plots', icon: LandPlot },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = filters.type === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`hero-tab-${tab.id}`}
                  type="button"
                  onClick={() => updateFilter('type', tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Input Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            {/* Search query */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Keyword or Community
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="hero-search-input"
                  type="text"
                  placeholder="e.g. Marina, Penthouse, View..."
                  value={filters.searchQuery}
                  onChange={e => updateFilter('searchQuery', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Location selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Region / City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="hero-city-select"
                  value={filters.city}
                  onChange={e => updateFilter('city', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                >
                  <option value="all">All Available Locations</option>
                  {cities.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Ceiling & Search Trigger */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Budget Ceiling
                </label>
                <select
                  id="hero-price-select"
                  value={filters.maxPrice}
                  onChange={e => updateFilter('maxPrice', Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                >
                  <option value={10000000}>Any Price ($10M+)</option>
                  <option value={2000000}>Up to $2,000,000</option>
                  <option value={3500000}>Up to $3,500,000</option>
                  <option value={5000000}>Up to $5,000,000</option>
                  <option value={7500000}>Up to $7,500,000</option>
                </select>
              </div>

              <button
                id="hero-search-btn"
                type="button"
                onClick={onSearchClick}
                className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Browse</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Agency Statistics Counter Bar */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl border-t border-stone-800/80">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif-title">
              {companyInfo.stats.propertiesSold}+
            </p>
            <p className="text-xs text-stone-400">Transactions Closed</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif-title">
              {companyInfo.stats.happyFamilies}+
            </p>
            <p className="text-xs text-stone-400">Happy Homeowners</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif-title">
              {companyInfo.stats.yearsInBusiness} Yrs
            </p>
            <p className="text-xs text-stone-400">Advisory Heritage</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif-title">
              {companyInfo.stats.agentsCount}
            </p>
            <p className="text-xs text-stone-400">Licensed Specialists</p>
          </div>
        </div>
      </div>
    </div>
  );
};
