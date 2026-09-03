import React from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { Property } from '../types';
import { X, Bed, Bath, Square, LandPlot, Trash2, Calendar, Check, Minus } from 'lucide-react';

interface PropertyComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
  onOpenBooking: (property: Property) => void;
}

export const PropertyComparisonModal: React.FC<PropertyComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectProperty,
  onOpenBooking,
}) => {
  const { compareList, toggleCompare, clearCompare, properties } = useRealEstate();

  if (!isOpen) return null;

  const comparedProperties = properties.filter(p => compareList.includes(p.id));

  return (
    <div
      id="comparison-drawer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              E-Commerce Product Matrix
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif-title">
              Compare Real Estate Properties ({comparedProperties.length})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {comparedProperties.length > 0 && (
              <button
                id="clear-all-compare-btn"
                type="button"
                onClick={clearCompare}
                className="text-xs text-stone-500 hover:text-rose-600 font-medium px-2 py-1"
              >
                Clear All
              </button>
            )}
            <button
              id="close-compare-modal-btn"
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto flex-1 p-6">
          {comparedProperties.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-base text-stone-600">No properties selected for comparison.</p>
              <p className="text-xs text-stone-400">
                Click the "Compare" button on any property card to view side-by-side specs.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-400 w-48">
                    Attribute
                  </th>
                  {comparedProperties.map(p => (
                    <th key={p.id} className="p-4 w-64 align-top">
                      <div className="space-y-2">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xs">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => toggleCompare(p.id)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-stone-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{p.title}</h4>
                        <p className="text-base font-extrabold text-amber-700">
                          ${p.price.toLocaleString()}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenBooking(p);
                          }}
                          className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Tour</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                <tr>
                  <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Property Type</td>
                  {comparedProperties.map(p => (
                    <td key={p.id} className="p-4 capitalize font-medium">
                      {p.type === 'flat' ? 'Flat / Apartment' : p.type === 'house' ? 'House / Villa' : 'Land / Parcel'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Location</td>
                  {comparedProperties.map(p => (
                    <td key={p.id} className="p-4">
                      {p.location.neighborhood}, {p.location.city}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Bedrooms / Baths</td>
                  {comparedProperties.map(p => (
                    <td key={p.id} className="p-4">
                      {p.type === 'land' ? 'N/A (Land)' : `${p.specs.bedrooms} Beds / ${p.specs.bathrooms} Baths`}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Area / Lot Size</td>
                  {comparedProperties.map(p => (
                    <td key={p.id} className="p-4 font-medium">
                      {p.type === 'land'
                        ? `${p.specs.lotSizeAcres} Acres`
                        : `${p.specs.areaSqFt.toLocaleString()} sqft`}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Price / Metric</td>
                  {comparedProperties.map(p => (
                    <td key={p.id} className="p-4 font-mono font-medium">
                      {p.type === 'land'
                        ? `$${Math.round(p.price / (p.specs.lotSizeAcres || 1)).toLocaleString()} / acre`
                        : `$${Math.round(p.price / p.specs.areaSqFt).toLocaleString()} / sqft`}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-stone-900 bg-stone-50/50">Key Highlight</td>
                  {comparedProperties.map(p => (
                    <td key={p.id} className="p-4 text-stone-600 line-clamp-2">
                      {p.features[0] || 'Prime Location'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
