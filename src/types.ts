export type PropertyType = 'flat' | 'house' | 'land';
export type PropertyStatus = 'for-sale' | 'featured' | 'price-drop' | 'pending' | 'sold';

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

export interface NeighborhoodPOI {
  name: string;
  category: 'transit' | 'school' | 'shopping' | 'park' | 'health';
  distance: string; // e.g. "0.3 miles" or "4 min walk"
  coords: { x: number; y: number }; // percentage coords on interactive neighborhood map
  description?: string;
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  type: PropertyType;
  price: number;
  originalPrice?: number;
  status: PropertyStatus;
  location: {
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
  specs: {
    bedrooms: number; // 0 for land / studio
    bathrooms: number;
    areaSqFt: number; // For flat/house
    lotSizeAcres?: number; // Particularly for land or houses with acreage
    yearBuilt?: number;
    garageSpaces?: number;
    zoning?: string; // For land (e.g., "Residential R-2", "Commercial C-1")
  };
  images: string[];
  videoUrl?: string; // YouTube embed or video link
  virtualTourUrl?: string;
  description: string;
  features: string[];
  neighborhoodPOIs: NeighborhoodPOI[];
  agentId: string;
  createdAt: string;
  isFeatured?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  specialty: string;
  phone: string;
  email: string;
  whatsapp?: string;
  avatar: string;
  licenseNumber: string;
  experienceYears: number;
  activeListingsCount?: number;
  bio: string;
}

export interface BookingRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  agentId: string;
  agentName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredDate: string;
  preferredTime: string;
  tourType: 'in-person' | 'video-call';
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  submittedAt: string;
}

export interface CompanyInfo {
  name: string;
  slogan: string;
  email: string;
  phone: string;
  emergencyPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  officeHours: string;
  logoUrl?: string;
  socials: {
    instagram: string;
    linkedin: string;
    facebook: string;
    youtube: string;
  };
  stats: {
    propertiesSold: number;
    happyFamilies: number;
    yearsInBusiness: number;
    agentsCount: number;
  };
}

export interface FilterState {
  searchQuery: string;
  type: 'all' | PropertyType;
  city: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'all';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'area-desc';
}
