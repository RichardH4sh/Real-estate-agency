import React from 'react';
import { Property } from '../types';
import { useRealEstate } from '../context/RealEstateContext';
import { X, Bed, Bath, Square, LandPlot, MapPin, Calendar, ArrowRight, Heart } from 'lucide-react';

interface QuickViewModalProps {
  property: Property | null;
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
  onOpenBooking: (property: Property) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  property,
  onClose,
  onSelectProperty,
  onOpenBooking,
}) => {
  const { favorites, toggleFavorite } = useRealEstate();

  if (!property) return null;
  const isFavorited = favorites.includes(property.id);

  return (
    <div
      id="quick-view-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        <button
          id="close-quick-view-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full bg-stone-100">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-stone-900 shadow-sm">
                {property.type}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-stone-900">
                  ${property.price.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => toggleFavorite(property.id)}
                  className="text-stone-400 hover:text-rose-600 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-stone-900 mt-2 font-serif-title">
                {property.title}
              </h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">{property.tagline}</p>

              <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-3">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {property.location.neighborhood}, {property.location.city}
                </span>
              </div>

              {/* Specs */}
              <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs">
                {property.type === 'land' ? (
                  <>
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <span className="text-[10px] text-stone-400 block">Lot Area</span>
                      <span className="font-bold text-stone-800">{property.specs.lotSizeAcres} Ac</span>
                    </div>
                    <div className="col-span-2 p-2 bg-stone-50 rounded-lg">
                      <span className="text-[10px] text-stone-400 block">Zoning</span>
                      <span className="font-bold text-stone-800 truncate block">{property.specs.zoning || 'Residential'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <span className="text-[10px] text-stone-400 block">Bedrooms</span>
                      <span className="font-bold text-stone-800">{property.specs.bedrooms}</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <span className="text-[10px] text-stone-400 block">Baths</span>
                      <span className="font-bold text-stone-800">{property.specs.bathrooms}</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <span className="text-[10px] text-stone-400 block">Sq Ft</span>
                      <span className="font-bold text-stone-800">{property.specs.areaSqFt.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBooking(property);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule VIP Tour</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectProperty(property);
                }}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span>Full Property Details & Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
