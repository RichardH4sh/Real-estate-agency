import React, { useState } from 'react';
import { NeighborhoodPOI } from '../types';
import { MapPin, Bus, GraduationCap, ShoppingBag, Trees, HeartPulse, Layers, Navigation, Compass } from 'lucide-react';

interface NeighborhoodMapProps {
  propertyTitle: string;
  neighborhood: string;
  city: string;
  latitude: number;
  longitude: number;
  pois: NeighborhoodPOI[];
}

export const NeighborhoodMap: React.FC<NeighborhoodMapProps> = ({
  propertyTitle,
  neighborhood,
  city,
  latitude,
  longitude,
  pois = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePOI, setActivePOI] = useState<NeighborhoodPOI | null>(null);
  const [mapStyle, setMapStyle] = useState<'blueprint' | 'satellite' | 'street'>('blueprint');

  const categories = [
    { id: 'all', label: 'All Highlights', icon: Layers },
    { id: 'transit', label: 'Transit', icon: Bus },
    { id: 'school', label: 'Schools', icon: GraduationCap },
    { id: 'shopping', label: 'Dining & Shops', icon: ShoppingBag },
    { id: 'park', label: 'Parks & Recreation', icon: Trees },
    { id: 'health', label: 'Healthcare', icon: HeartPulse },
  ];

  const filteredPOIs = selectedCategory === 'all'
    ? pois
    : pois.filter(poi => poi.category === selectedCategory);

  const getCategoryIcon = (cat: NeighborhoodPOI['category']) => {
    switch (cat) {
      case 'transit':
        return <Bus className="w-4 h-4" />;
      case 'school':
        return <GraduationCap className="w-4 h-4" />;
      case 'shopping':
        return <ShoppingBag className="w-4 h-4" />;
      case 'park':
        return <Trees className="w-4 h-4" />;
      case 'health':
        return <HeartPulse className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (cat: NeighborhoodPOI['category']) => {
    switch (cat) {
      case 'transit':
        return 'bg-blue-600 text-white border-blue-400';
      case 'school':
        return 'bg-amber-600 text-white border-amber-400';
      case 'shopping':
        return 'bg-emerald-600 text-white border-emerald-400';
      case 'park':
        return 'bg-teal-600 text-white border-teal-400';
      case 'health':
        return 'bg-rose-600 text-white border-rose-400';
      default:
        return 'bg-stone-800 text-white border-stone-500';
    }
  };

  return (
    <div id="neighborhood-map-container" className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-xs">
      {/* Map Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-700" />
            <h3 className="text-lg font-semibold text-stone-900 font-serif-title">Neighborhood & Vicinity Map</h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {neighborhood}, {city} &bull; Coordinates: {latitude.toFixed(4)}° N, {Math.abs(longitude).toFixed(4)}° W
          </p>
        </div>

        {/* Map style toggle */}
        <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-lg text-xs font-medium text-stone-700">
          <button
            id="map-style-blueprint"
            type="button"
            onClick={() => setMapStyle('blueprint')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mapStyle === 'blueprint' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'hover:text-stone-950'
            }`}
          >
            Architectural
          </button>
          <button
            id="map-style-street"
            type="button"
            onClick={() => setMapStyle('street')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mapStyle === 'street' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'hover:text-stone-950'
            }`}
          >
            Streets
          </button>
          <button
            id="map-style-satellite"
            type="button"
            onClick={() => setMapStyle('satellite')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mapStyle === 'satellite' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'hover:text-stone-950'
            }`}
          >
            Terrain
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-4 py-2.5 bg-white border-b border-stone-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`poi-filter-${cat.id}`}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 font-medium'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Map Canvas / Visual Stage */}
      <div className="relative w-full h-80 sm:h-96 overflow-hidden select-none">
        {/* Background styled map grid */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            mapStyle === 'blueprint'
              ? 'bg-stone-100'
              : mapStyle === 'street'
              ? 'bg-[#e5e3df]'
              : 'bg-[#1b262c]'
          }`}
        >
          {/* SVG Map Grid & Streets */}
          <svg className="w-full h-full opacity-70" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="street-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke={mapStyle === 'satellite' ? '#2f3e46' : '#d6d3d1'}
                  strokeWidth="1"
                />
              </pattern>
              <radialGradient id="property-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Grid */}
            <rect width="100%" height="100%" fill="url(#street-grid)" />

            {/* Stylized arterial roads & water features */}
            <path
              d="M -20 180 Q 250 140 600 240 T 1200 200"
              fill="none"
              stroke={mapStyle === 'satellite' ? '#354f52' : '#cbd5e1'}
              strokeWidth="24"
              strokeLinecap="round"
            />
            <path
              d="M -20 180 Q 250 140 600 240 T 1200 200"
              fill="none"
              stroke={mapStyle === 'satellite' ? '#2f3e46' : '#ffffff'}
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Secondary boulevard */}
            <path
              d="M 280 -20 Q 320 220 540 450"
              fill="none"
              stroke={mapStyle === 'satellite' ? '#354f52' : '#cbd5e1'}
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M 280 -20 Q 320 220 540 450"
              fill="none"
              stroke={mapStyle === 'satellite' ? '#2f3e46' : '#ffffff'}
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Diagonal scenic avenue */}
            <path
              d="M 100 400 L 700 80"
              fill="none"
              stroke={mapStyle === 'satellite' ? '#2f3e46' : '#ffffff'}
              strokeWidth="8"
            />

            {/* Park / Greenery zone */}
            <circle
              cx="75%"
              cy="28%"
              r="70"
              fill={mapStyle === 'satellite' ? '#1b4332' : '#dcfce7'}
              opacity={mapStyle === 'satellite' ? 0.7 : 0.8}
            />

            {/* Property center glow */}
            <circle cx="50%" cy="50%" r="90" fill="url(#property-glow)" />
          </svg>
        </div>

        {/* Center Main Property Pin */}
        <div
          className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
          onClick={() => setActivePOI(null)}
        >
          <div className="relative">
            <span className="absolute -inset-2 rounded-full bg-amber-500/30 animate-ping" />
            <div className="relative w-11 h-11 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-amber-500/20">
              <MapPin className="w-6 h-6 fill-white" />
            </div>
          </div>
          <div className="mt-2 bg-stone-900/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md whitespace-nowrap border border-stone-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Subject Property</span>
          </div>
        </div>

        {/* Interactive POI Markers */}
        {filteredPOIs.map((poi, idx) => {
          const isSelected = activePOI?.name === poi.name;
          return (
            <div
              key={idx}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-125 cursor-pointer"
              style={{ top: `${poi.coords.y}%`, left: `${poi.coords.x}%` }}
              onClick={() => setActivePOI(poi)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 transition-all ${getCategoryColor(
                  poi.category
                )} ${isSelected ? 'ring-4 ring-amber-500 scale-125' : ''}`}
                title={`${poi.name} (${poi.distance})`}
              >
                {getCategoryIcon(poi.category)}
              </div>
            </div>
          );
        })}

        {/* Selected POI Floating Card */}
        {activePOI && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs z-30 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-stone-200 shadow-xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getCategoryColor(activePOI.category)}`}>
                  {getCategoryIcon(activePOI.category)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900 leading-tight">{activePOI.name}</h4>
                  <span className="text-xs text-amber-700 font-medium">{activePOI.distance}</span>
                </div>
              </div>
              <button
                id="close-poi-card"
                type="button"
                onClick={() => setActivePOI(null)}
                className="text-stone-400 hover:text-stone-700 text-xs px-1.5 py-0.5 rounded-md hover:bg-stone-100"
              >
                ✕
              </button>
            </div>
            {activePOI.description && (
              <p className="text-xs text-stone-600 mt-2 line-clamp-2">{activePOI.description}</p>
            )}
          </div>
        )}

        {/* Compass & Quick Metric Overlay */}
        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 shadow-xs flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-stone-500 rotate-45" />
          <span>Walk Score: 94 &bull; Transit Score: 88</span>
        </div>
      </div>

      {/* POI List Summary */}
      <div className="p-4 bg-stone-50/50 border-t border-stone-100">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
          Nearby Amenities & Walking Times ({filteredPOIs.length})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredPOIs.map((poi, idx) => (
            <div
              key={idx}
              onClick={() => setActivePOI(poi)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                activePOI?.name === poi.name
                  ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${getCategoryColor(poi.category)}`}>
                  {getCategoryIcon(poi.category)}
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-stone-900 truncate">{poi.name}</p>
                  <p className="text-[11px] text-stone-500">{poi.distance}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
