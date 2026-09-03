import React from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { PropertyType } from '../types';
import {
  Building2,
  Heart,
  Layers,
  Calendar,
  ShieldAlert,
  Download,
  Settings,
  Menu,
  X,
  Sparkles,
  Home,
  LandPlot,
} from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenCompare: () => void;
  onOpenBooking: () => void;
  onDownloadZip: () => void;
  onFilterFavorites: () => void;
  isFilteringFavorites: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onOpenCompare,
  onOpenBooking,
  onDownloadZip,
  onFilterFavorites,
  isFilteringFavorites,
}) => {
  const { companyInfo, favorites, compareList, bookings, filters, updateFilter } = useRealEstate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;

  const handleNavType = (type: 'all' | PropertyType) => {
    updateFilter('type', type);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavType('all')}
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md group-hover:bg-amber-700 transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900 font-serif-title flex items-center gap-1.5">
                {companyInfo.name}
              </span>
              <span className="text-[11px] font-medium tracking-wide uppercase text-amber-700 block">
                Exclusive Real Estate Advisory
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (E-commerce categories) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-stone-700">
            <button
              type="button"
              onClick={() => handleNavType('all')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                filters.type === 'all' && !isFilteringFavorites
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              All Listings
            </button>
            <button
              type="button"
              onClick={() => handleNavType('flat')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                filters.type === 'flat' && !isFilteringFavorites
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              Flats & Condos
            </button>
            <button
              type="button"
              onClick={() => handleNavType('house')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                filters.type === 'house' && !isFilteringFavorites
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              Houses & Villas
            </button>
            <button
              type="button"
              onClick={() => handleNavType('land')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                filters.type === 'land' && !isFilteringFavorites
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              Lands & Plots
            </button>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Favorites Filter Toggle */}
            <button
              id="header-favs-btn"
              type="button"
              onClick={onFilterFavorites}
              className={`relative p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 ${
                isFilteringFavorites
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
              title="View Wishlist"
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden lg:inline">Saved</span>
              {favorites.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Compare Drawer Toggle */}
            <button
              id="header-compare-btn"
              type="button"
              onClick={onOpenCompare}
              className={`relative p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 ${
                compareList.length > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
              title="Compare selected listings"
            >
              <Layers className="w-4 h-4 text-amber-700" />
              <span className="hidden lg:inline">Compare</span>
              {compareList.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Schedule Viewing CTA */}
            <button
              id="header-book-tour-btn"
              type="button"
              onClick={onOpenBooking}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Viewing</span>
            </button>

            {/* Admin Area Button */}
            /*<button
              id="header-admin-btn"
              type="button"
              onClick={onOpenAdmin}
              className="relative bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Area</span>
              {pendingBookingsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>*/

            {/* Direct ZIP Export Badge */}
            <button
              id="header-download-zip-btn"
              type="button"
              onClick={onDownloadZip}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Download compiled files in a ZIP file"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="p-2 rounded-xl bg-stone-900 text-white text-xs"
            >
              <Settings className="w-4 h-4 text-amber-400" />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-stone-200 text-stone-700"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-stone-200 py-4 space-y-2 text-xs font-semibold animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 pb-3">
              <button
                type="button"
                onClick={() => handleNavType('all')}
                className="p-2.5 rounded-xl bg-stone-100 text-stone-900 text-center"
              >
                All Listings
              </button>
              <button
                type="button"
                onClick={() => handleNavType('flat')}
                className="p-2.5 rounded-xl bg-stone-100 text-stone-900 text-center"
              >
                Flats
              </button>
              <button
                type="button"
                onClick={() => handleNavType('house')}
                className="p-2.5 rounded-xl bg-stone-100 text-stone-900 text-center"
              >
                Houses
              </button>
              <button
                type="button"
                onClick={() => handleNavType('land')}
                className="p-2.5 rounded-xl bg-stone-100 text-stone-900 text-center"
              >
                Lands
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-2.5 bg-amber-600 text-white rounded-xl text-center font-bold"
              >
                Schedule VIP Tour
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onDownloadZip();
                }}
                className="w-full py-2.5 border border-stone-200 text-stone-800 rounded-xl text-center flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Website ZIP</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
