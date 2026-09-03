import React, { useState, useMemo } from 'react';
import { RealEstateProvider, useRealEstate } from './context/RealEstateContext';
import { Property, PropertyType } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { PropertyCard } from './components/PropertyCard';
import { PropertyFilters } from './components/PropertyFilters';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PhotoGalleryModal } from './components/PhotoGalleryModal';
import { QuickViewModal } from './components/QuickViewModal';
import { BookingModal } from './components/BookingModal';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';
import { AdminPortal } from './components/AdminPortal';
import { DownloadZipModal } from './components/DownloadZipModal';
import { Footer } from './components/Footer';
import {
  Building2,
  SlidersHorizontal,
  Heart,
  Layers,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Check,
  Download,
} from 'lucide-react';

function RealEstateApp() {
  const { properties, filters, favorites, compareList, resetFilters } = useRealEstate();

  // Modal visibility states
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [quickViewProperty, setQuickViewProperty] = useState<Property | null>(null);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isDownloadZipOpen, setIsDownloadZipOpen] = useState(false);
  const [isFilteringFavorites, setIsFilteringFavorites] = useState(false);

  // Gallery Lightbox state
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [galleryVideoUrl, setGalleryVideoUrl] = useState<string | undefined>(undefined);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleOpenGallery = (images: string[], initialIndex = 0, videoUrl?: string) => {
    setGalleryImages(images);
    setGalleryInitialIndex(initialIndex);
    setGalleryVideoUrl(videoUrl);
    setIsGalleryOpen(true);
  };

  const handleOpenBooking = (property?: Property) => {
    setBookingProperty(property || null);
    setIsBookingOpen(true);
  };

  // Filter and sort properties based on state
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // Favorites filter mode
      if (isFilteringFavorites && !favorites.includes(p.id)) {
        return false;
      }

      // Property type filter
      if (filters.type !== 'all' && p.type !== filters.type) {
        return false;
      }

      // Location / City filter
      if (filters.city !== 'all' && p.location.city !== filters.city) {
        return false;
      }

      // Price ceiling filter
      if (p.price > filters.maxPrice) {
        return false;
      }

      // Bedrooms filter (only for flats and houses)
      if (filters.bedrooms !== 'all') {
        if (p.type === 'land') {
          return false; // Land has 0 bedrooms
        }
        if (p.specs.bedrooms < Number(filters.bedrooms)) {
          return false;
        }
      }

      // Keyword search (matches title, tagline, neighborhood, address, city, features)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesTagline = p.tagline.toLowerCase().includes(q);
        const matchesNeighborhood = p.location.neighborhood.toLowerCase().includes(q);
        const matchesAddress = p.location.address.toLowerCase().includes(q);
        const matchesCity = p.location.city.toLowerCase().includes(q);
        const matchesFeature = p.features.some(f => f.toLowerCase().includes(q));

        if (
          !matchesTitle &&
          !matchesTagline &&
          !matchesNeighborhood &&
          !matchesAddress &&
          !matchesCity &&
          !matchesFeature
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'area-desc':
          const aArea = a.specs.areaSqFt || (a.specs.lotSizeAcres || 0) * 43560;
          const bArea = b.specs.areaSqFt || (b.specs.lotSizeAcres || 0) * 43560;
          return bArea - aArea;
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [properties, filters, isFilteringFavorites, favorites]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Primary Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenBooking={() => handleOpenBooking()}
        onDownloadZip={() => setIsDownloadZipOpen(true)}
        onFilterFavorites={() => setIsFilteringFavorites(!isFilteringFavorites)}
        isFilteringFavorites={isFilteringFavorites}
      />

      {/* Hero Banner Section */}
      <HeroBanner
        onSearchClick={() => {
          const catalogEl = document.getElementById('properties-catalog-section');
          catalogEl?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Real Estate Catalog Section */}
      <main id="properties-catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Wishlist Active Notification Banner */}
        {isFilteringFavorites && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-950">Viewing Saved Favorites ({favorites.length})</h3>
                <p className="text-xs text-rose-700">Showing only properties you have added to your wishlist.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFilteringFavorites(false)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 transition-colors"
            >
              Show All Properties
            </button>
          </div>
        )}

        {/* E-Commerce Search & Filter Toolbars */}
        <PropertyFilters totalCount={filteredProperties.length} />

        {/* Product Grid Layout */}
        {filteredProperties.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-serif-title">
              No matching properties found
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We couldn't find any flats, houses, or land parcels matching your current filter criteria. Try adjusting your budget, location, or bedrooms.
            </p>
            <button
              type="button"
              onClick={() => {
                resetFilters();
                setIsFilteringFavorites(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Reset All Search Filters
            </button>
          </div>
        ) : (
          /* Real Estate Product Grid Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelectProperty={prop => setSelectedProperty(prop)}
                onQuickView={prop => setQuickViewProperty(prop)}
                onOpenBooking={prop => handleOpenBooking(prop)}
              />
            ))}
          </div>
        )}

        {/* Floating Comparison Tray (E-commerce feature) */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 right-6 z-30 bg-stone-900 text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold">{compareList.length} Selected for Comparison</span>
            </div>
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Compare Side-by-Side
            </button>
          </div>
        )}
      </main>

      {/* Primary Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onDownloadZip={() => setIsDownloadZipOpen(true)}
        onSelectCategory={type => {
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />

      {/* Comprehensive Property Details & Neighborhood Map Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onOpenBooking={prop => handleOpenBooking(prop)}
        onOpenGallery={handleOpenGallery}
      />

      {/* Full-Screen High-Resolution Lightbox Photo Gallery Modal */}
      <PhotoGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={galleryImages}
        title={selectedProperty?.title || 'Property Gallery'}
        initialIndex={galleryInitialIndex}
        videoUrl={galleryVideoUrl}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        property={quickViewProperty}
        onClose={() => setQuickViewProperty(null)}
        onSelectProperty={prop => setSelectedProperty(prop)}
        onOpenBooking={prop => handleOpenBooking(prop)}
      />

      {/* Tour Booking Request Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedProperty={bookingProperty}
      />

      {/* Side-by-Side Property Comparison Modal */}
      <PropertyComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectProperty={prop => setSelectedProperty(prop)}
        onOpenBooking={prop => handleOpenBooking(prop)}
      />

      {/* Full Admin Management Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onSelectPropertyForView={prop => setSelectedProperty(prop)}
      />

      {/* Download Web Hosting ZIP Modal */}
      <DownloadZipModal
        isOpen={isDownloadZipOpen}
        onClose={() => setIsDownloadZipOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <RealEstateProvider>
      <RealEstateApp />
    </RealEstateProvider>
  );
}
