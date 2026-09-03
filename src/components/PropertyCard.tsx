import React, { useState } from 'react';
import { Property } from '../types';
import { useRealEstate } from '../context/RealEstateContext';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Heart,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Check,
  ChevronLeft,
  ChevronRight,
  LandPlot,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelectProperty: (property: Property) => void;
  onQuickView: (property: Property) => void;
  onOpenBooking: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelectProperty,
  onQuickView,
  onOpenBooking,
}) => {
  const { favorites, toggleFavorite, compareList, toggleCompare, agents } = useRealEstate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isFavorited = favorites.includes(property.id);
  const isCompared = compareList.includes(property.id);
  const agent = agents.find(a => a.id === property.agentId);

  // Type label styling
  const getTypeBadge = (type: Property['type']) => {
    switch (type) {
      case 'flat':
        return { label: 'Flat / Apt', bg: 'bg-sky-100 text-sky-800 border-sky-200' };
      case 'house':
        return { label: 'House / Villa', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'land':
        return { label: 'Land Parcel', bg: 'bg-amber-100 text-amber-900 border-amber-200' };
      default:
        return { label: 'Property', bg: 'bg-stone-100 text-stone-800 border-stone-200' };
    }
  };

  const typeInfo = getTypeBadge(property.type);

  // Next/prev image on the card
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  // Monthly estimate (rough calculation based on 30-year 6.5% interest rate + 20% down)
  const monthlyEst = Math.round((property.price * 0.8 * 0.00632) + (property.price * 0.012 / 12));

  return (
    <div
      id={`property-card-${property.id}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-xl hover:border-amber-400/60 transition-all duration-300 overflow-hidden"
    >
      {/* Media / Carousel Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => onSelectProperty(property)}
          referrerPolicy="no-referrer"
        />

        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Carousel arrows (visible on hover) */}
        {property.images.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              id={`prev-img-${property.id}`}
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-transform hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id={`next-img-${property.id}`}
              type="button"
              onClick={handleNextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-transform hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
            {property.images.slice(0, 5).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-xs ${typeInfo.bg}`}>
            {typeInfo.label}
          </span>
          {property.status === 'price-drop' && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-xs flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              <span>Price Drop</span>
            </span>
          )}
          {property.isFeatured && property.status !== 'price-drop' && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Exclusive</span>
            </span>
          )}
        </div>

        {/* Top Action Icons (Heart & Quick View) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            id={`quick-view-btn-${property.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(property);
            }}
            className="w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-all hover:scale-110"
            title="Quick Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            id={`fav-btn-${property.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            className={`w-8 h-8 rounded-full backdrop-blur-xs shadow-md flex items-center justify-center transition-all hover:scale-110 ${
              isFavorited
                ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                : 'bg-stone-900/60 hover:bg-stone-900 text-white'
            }`}
            title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Compare pill on bottom left of image */}
        <div className="absolute bottom-3 left-3">
          <button
            id={`compare-btn-${property.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(property.id);
            }}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border backdrop-blur-md transition-all flex items-center gap-1.5 ${
              isCompared
                ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                : 'bg-stone-900/70 text-stone-200 border-stone-700/60 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>{isCompared ? 'In Compare' : 'Compare'}</span>
          </button>
        </div>
      </div>

      {/* Card Body - E-Commerce Style Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Price & Monthly Tag */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                ${property.price.toLocaleString()}
              </span>
              {property.originalPrice && (
                <span className="text-xs text-stone-400 line-through ml-2">
                  ${property.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {property.type !== 'land' ? (
              <span className="text-[11px] text-stone-500 font-medium whitespace-nowrap">
                ~${monthlyEst.toLocaleString()}/mo
              </span>
            ) : (
              <span className="text-[11px] text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ${Math.round(property.price / (property.specs.lotSizeAcres || 1)).toLocaleString()} / acre
              </span>
            )}
          </div>

          {/* Title & Tagline */}
          <h3
            onClick={() => onSelectProperty(property)}
            className="text-base font-semibold text-stone-900 mt-1.5 group-hover:text-amber-700 transition-colors line-clamp-1 cursor-pointer font-serif-title"
          >
            {property.title}
          </h3>
          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{property.tagline}</p>

          {/* Location Line */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-2">
            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="truncate">
              {property.location.neighborhood}, {property.location.city}
            </span>
          </div>
        </div>

        {/* Specs Pill Grid (E-commerce feature matrix) */}
        <div className="pt-2 border-t border-stone-100">
          {property.type === 'land' ? (
            <div className="grid grid-cols-2 gap-2 text-xs py-1">
              <div className="flex items-center gap-1.5 text-stone-700 bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                <LandPlot className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="font-semibold">{property.specs.lotSizeAcres} Acres</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-700 bg-stone-50 p-1.5 rounded-lg border border-stone-100 truncate">
                <span className="text-[10px] uppercase font-bold text-stone-500">Zone:</span>
                <span className="font-medium truncate text-[11px]">{property.specs.zoning?.split(' ')[0] || 'Approved'}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 text-xs py-1">
              <div className="flex items-center gap-1 text-stone-700 bg-stone-50 p-1.5 rounded-lg border border-stone-100 justify-center">
                <Bed className="w-3.5 h-3.5 text-stone-500" />
                <span className="font-semibold">{property.specs.bedrooms}</span>
                <span className="text-[10px] text-stone-500">Beds</span>
              </div>
              <div className="flex items-center gap-1 text-stone-700 bg-stone-50 p-1.5 rounded-lg border border-stone-100 justify-center">
                <Bath className="w-3.5 h-3.5 text-stone-500" />
                <span className="font-semibold">{property.specs.bathrooms}</span>
                <span className="text-[10px] text-stone-500">Baths</span>
              </div>
              <div className="flex items-center gap-1 text-stone-700 bg-stone-50 p-1.5 rounded-lg border border-stone-100 justify-center">
                <Square className="w-3.5 h-3.5 text-stone-500" />
                <span className="font-semibold">{property.specs.areaSqFt.toLocaleString()}</span>
                <span className="text-[10px] text-stone-500">sqft</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: E-Commerce Grid CTA */}
        <div className="pt-2 flex items-center gap-2">
          <button
            id={`book-tour-card-btn-${property.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenBooking(property);
            }}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Tour</span>
          </button>
          <button
            id={`view-details-card-btn-${property.id}`}
            type="button"
            onClick={() => onSelectProperty(property)}
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center gap-1 border border-stone-200"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
