import React, { useState } from 'react';
import { Property, Agent } from '../types';
import { useRealEstate } from '../context/RealEstateContext';
import { NeighborhoodMap } from './NeighborhoodMap';
import {
  X,
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Heart,
  Share2,
  Play,
  Maximize2,
  Check,
  Phone,
  Mail,
  MessageCircle,
  Building,
  LandPlot,
  Calculator,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onOpenBooking: (property: Property) => void;
  onOpenGallery: (images: string[], initialIndex: number, videoUrl?: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onOpenBooking,
  onOpenGallery,
}) => {
  const { agents, favorites, toggleFavorite } = useRealEstate();
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!property) return null;

  const agent: Agent = agents.find(a => a.id === property.agentId) || agents[0];
  const isFavorited = favorites.includes(property.id);

  // Mortgage calculation
  const downPayment = (property.price * downPaymentPercent) / 100;
  const principal = property.price - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTermYears * 12;
  const monthlyMortgage =
    monthlyRate > 0
      ? (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : principal / numPayments;
  const monthlyPropertyTax = (property.price * 0.012) / 12;
  const monthlyInsurance = 180;
  const totalMonthly = Math.round(monthlyMortgage + monthlyPropertyTax + monthlyInsurance);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      id="property-detail-modal"
      className="fixed inset-0 z-40 flex justify-center bg-stone-950/80 backdrop-blur-md overflow-y-auto p-2 sm:p-4 lg:p-6"
    >
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-stone-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
              {property.type.toUpperCase()}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 truncate font-serif-title">
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="detail-share-btn"
              type="button"
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors text-xs"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="detail-favorite-btn"
              type="button"
              onClick={() => toggleFavorite(property.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isFavorited
                  ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              id="detail-close-btn"
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          {/* Photo Mosaic Gallery Grid */}
          <div className="relative rounded-2xl overflow-hidden shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 h-72 sm:h-96">
              {/* Main big image */}
              <div
                className="sm:col-span-2 relative group overflow-hidden cursor-pointer h-full"
                onClick={() => onOpenGallery(property.images, 0, property.videoUrl)}
              >
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View Fullscreen Gallery ({property.images.length})</span>
                </div>
              </div>

              {/* Smaller secondary images */}
              <div className="hidden sm:grid sm:col-span-2 grid-cols-2 gap-2 h-full">
                {property.images.slice(1, 5).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group overflow-hidden cursor-pointer h-full"
                    onClick={() => onOpenGallery(property.images, idx + 1, property.videoUrl)}
                  >
                    <img
                      src={img}
                      alt={`${property.title} photo ${idx + 2}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    {idx === 3 && property.images.length > 5 && (
                      <div className="absolute inset-0 bg-stone-950/70 flex items-center justify-center text-white font-bold text-sm">
                        +{property.images.length - 4} More Photos
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Video Tour Quick Action Button */}
            {property.videoUrl && (
              <button
                id="watch-video-tour-banner-btn"
                type="button"
                onClick={() => onOpenGallery(property.images, 0, property.videoUrl)}
                className="absolute top-4 right-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-sm transition-all hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch HD Video Tour</span>
              </button>
            )}
          </div>

          {/* Pricing & Key Highlights Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                  ${property.price.toLocaleString()}
                </span>
                {property.originalPrice && (
                  <span className="text-base text-stone-400 line-through">
                    ${property.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Est. Mortgage ${totalMonthly.toLocaleString()}/mo
                </span>
              </div>

              <div className="flex items-center gap-2 text-stone-600 text-sm">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  {property.location.address}, {property.location.neighborhood}, {property.location.city},{' '}
                  {property.location.state} {property.location.zipCode}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex items-center gap-3">
              <button
                id="detail-book-tour-cta-btn"
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBooking(property);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule VIP Tour</span>
              </button>
            </div>
          </div>

          {/* E-Commerce Key Specifications Matrix */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
              Comprehensive Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {property.type !== 'land' ? (
                <>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Bedrooms</span>
                    <span className="text-base font-bold text-stone-900">{property.specs.bedrooms}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Bathrooms</span>
                    <span className="text-base font-bold text-stone-900">{property.specs.bathrooms}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Living Space</span>
                    <span className="text-base font-bold text-stone-900">
                      {property.specs.areaSqFt.toLocaleString()} sqft
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Price / SqFt</span>
                    <span className="text-base font-bold text-stone-900">
                      ${Math.round(property.price / property.specs.areaSqFt).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Garage / Parking</span>
                    <span className="text-base font-bold text-stone-900">
                      {property.specs.garageSpaces || 1} Vehicle(s)
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Year Built</span>
                    <span className="text-base font-bold text-stone-900">
                      {property.specs.yearBuilt || 2022}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Total Lot Area</span>
                    <span className="text-base font-bold text-stone-900">
                      {property.specs.lotSizeAcres} Acres
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Price / Acre</span>
                    <span className="text-base font-bold text-stone-900">
                      ${Math.round(property.price / (property.specs.lotSizeAcres || 1)).toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2 bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Zoning & Permits</span>
                    <span className="text-sm font-bold text-stone-900 truncate block">
                      {property.specs.zoning || 'Residential Agricultural'}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Utilities</span>
                    <span className="text-sm font-bold text-stone-900">Conduit & Well Ready</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 block">Property Type</span>
                    <span className="text-sm font-bold text-stone-900">Fee Simple Land</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description & Features Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2 font-serif-title">
                  About This Residence
                </h3>
                <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Curated Features Checklist */}
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider text-xs">
                  Key Amenities & Architectural Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-100"
                    >
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assigned Agent Contact Card */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Listing Specialist
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-base font-bold text-stone-900">{agent.name}</h4>
                  <p className="text-xs text-stone-500">{agent.title}</p>
                  <span className="text-[11px] text-stone-400 font-mono">{agent.licenseNumber}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed border-t border-stone-200 pt-3">
                {agent.bio}
              </p>

              {/* Direct Communication Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={`tel:${agent.phone}`}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 hover:bg-stone-100 transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                  <span>Call {agent.phone}</span>
                </a>
                <a
                  href={`mailto:${agent.email}?subject=Inquiry on ${encodeURIComponent(property.title)}`}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 hover:bg-stone-100 transition-colors shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5 text-stone-600" />
                  <span>Send Direct Email</span>
                </a>
                {agent.whatsapp && (
                  <a
                    href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Neighborhood Map Component */}
          <div>
            <NeighborhoodMap
              propertyTitle={property.title}
              neighborhood={property.location.neighborhood}
              city={property.location.city}
              latitude={property.location.latitude}
              longitude={property.location.longitude}
              pois={property.neighborhoodPOIs}
            />
          </div>

          {/* Mortgage & Financial Estimator Widget */}
          <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2.5">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold font-serif-title">
                Mortgage & Monthly Investment Calculator
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs text-stone-400 mb-1.5">
                  Down Payment ({downPaymentPercent}% = ${downPayment.toLocaleString()})
                </label>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  value={downPaymentPercent}
                  onChange={e => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-stone-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1.5">
                  Loan Duration ({loanTermYears} Years Fixed)
                </label>
                <div className="flex gap-2">
                  {[15, 30].map(term => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setLoanTermYears(term)}
                      className={`flex-1 py-1.5 text-xs rounded-lg font-medium border ${
                        loanTermYears === term
                          ? 'bg-amber-500 text-stone-950 border-amber-400'
                          : 'bg-stone-800 text-stone-300 border-stone-700'
                      }`}
                    >
                      {term} Years
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1.5">
                  Interest Rate ({interestRate}%)
                </label>
                <input
                  type="range"
                  min={4.5}
                  max={9.0}
                  step={0.25}
                  value={interestRate}
                  onChange={e => setInterestRate(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-stone-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs text-stone-400">Estimated Total Monthly Cost</span>
                <p className="text-2xl sm:text-3xl font-bold text-amber-400">
                  ${totalMonthly.toLocaleString()} <span className="text-xs text-stone-400 font-normal">/ month</span>
                </p>
              </div>
              <div className="text-xs text-stone-400 text-right space-y-0.5">
                <p>Principal & Interest: ${Math.round(monthlyMortgage).toLocaleString()}</p>
                <p>Est. Taxes: ${Math.round(monthlyPropertyTax).toLocaleString()} &bull; Homeowners Ins: ${monthlyInsurance}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
