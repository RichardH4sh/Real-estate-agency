import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Agent, CompanyInfo, BookingRequest, FilterState, PropertyType } from '../types';
import { initialProperties, initialAgents, initialCompanyInfo, initialBookings } from '../data/initialData';

const LOCAL_STORAGE_KEY_PROPS = 'haven_hearth_properties_v1';
const LOCAL_STORAGE_KEY_AGENTS = 'haven_hearth_agents_v1';
const LOCAL_STORAGE_KEY_COMPANY = 'haven_hearth_company_v1';
const LOCAL_STORAGE_KEY_BOOKINGS = 'haven_hearth_bookings_v1';
const LOCAL_STORAGE_KEY_FAVS = 'haven_hearth_favs_v1';

export const initialFilterState: FilterState = {
  searchQuery: '',
  type: 'all',
  city: 'all',
  minPrice: 0,
  maxPrice: 10000000,
  bedrooms: 'all',
  sortBy: 'featured',
};

interface RealEstateContextType {
  properties: Property[];
  agents: Agent[];
  companyInfo: CompanyInfo;
  bookings: BookingRequest[];
  favorites: string[];
  compareList: string[];
  filters: FilterState;
  
  // Property management
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Property;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  
  // Agent management
  addAgent: (agent: Omit<Agent, 'id'>) => Agent;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (id: string) => void;
  
  // Company info
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  
  // Bookings
  addBooking: (booking: Omit<BookingRequest, 'id' | 'submittedAt' | 'status'>) => BookingRequest;
  updateBookingStatus: (id: string, status: BookingRequest['status']) => void;
  deleteBooking: (id: string) => void;
  
  // Favorites & Compare
  toggleFavorite: (propertyId: string) => void;
  toggleCompare: (propertyId: string) => void;
  clearCompare: () => void;
  
  // Filters
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  
  // Admin Utilities
  resetToDefaults: () => void;
}

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

export const RealEstateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Properties state
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROPS);
      return saved ? JSON.parse(saved) : initialProperties;
    } catch {
      return initialProperties;
    }
  });

  // Agents state
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_AGENTS);
      return saved ? JSON.parse(saved) : initialAgents;
    } catch {
      return initialAgents;
    }
  });

  // Company info state
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_COMPANY);
      return saved ? JSON.parse(saved) : initialCompanyInfo;
    } catch {
      return initialCompanyInfo;
    }
  });

  // Bookings state
  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKINGS);
      return saved ? JSON.parse(saved) : initialBookings;
    } catch {
      return initialBookings;
    }
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_FAVS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Comparison
  const [compareList, setCompareList] = useState<string[]>([]);

  // Search & Filters
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROPS, JSON.stringify(properties));
    } catch (e) {
      console.warn('LocalStorage save failed for properties', e);
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_AGENTS, JSON.stringify(agents));
    } catch (e) {
      console.warn('LocalStorage save failed for agents', e);
    }
  }, [agents]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_COMPANY, JSON.stringify(companyInfo));
    } catch (e) {
      console.warn('LocalStorage save failed for companyInfo', e);
    }
  }, [companyInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.warn('LocalStorage save failed for bookings', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_FAVS, JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage save failed for favorites', e);
    }
  }, [favorites]);

  // Actions
  const addProperty = (newPropData: Omit<Property, 'id' | 'createdAt'>): Property => {
    const newProperty: Property = {
      ...newPropData,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProperties(prev => [newProperty, ...prev]);
    return newProperty;
  };

  const updateProperty = (updated: Property) => {
    setProperties(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setFavorites(prev => prev.filter(fId => fId !== id));
    setCompareList(prev => prev.filter(cId => cId !== id));
  };

  const addAgent = (newAgentData: Omit<Agent, 'id'>): Agent => {
    const newAgent: Agent = {
      ...newAgentData,
      id: `agent-${Date.now()}`,
    };
    setAgents(prev => [...prev, newAgent]);
    return newAgent;
  };

  const updateAgent = (updated: Agent) => {
    setAgents(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };

  const deleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    setCompanyInfo(prev => ({
      ...prev,
      ...info,
      socials: {
        ...prev.socials,
        ...(info.socials || {}),
      },
      stats: {
        ...prev.stats,
        ...(info.stats || {}),
      },
    }));
  };

  const addBooking = (bookingData: Omit<BookingRequest, 'id' | 'submittedAt' | 'status'>): BookingRequest => {
    const newBooking: BookingRequest = {
      ...bookingData,
      id: `book-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingRequest['status']) => {
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  const toggleCompare = (propertyId: string) => {
    setCompareList(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      }
      if (prev.length >= 4) {
        // limit to 4 items for clean comparison UI
        return [...prev.slice(1), propertyId];
      }
      return [...prev, propertyId];
    });
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  const resetToDefaults = () => {
    setProperties(initialProperties);
    setAgents(initialAgents);
    setCompanyInfo(initialCompanyInfo);
    setBookings(initialBookings);
    setFavorites([]);
    setCompareList([]);
    setFilters(initialFilterState);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PROPS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_AGENTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_COMPANY);
    localStorage.removeItem(LOCAL_STORAGE_KEY_BOOKINGS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_FAVS);
  };

  return (
    <RealEstateContext.Provider
      value={{
        properties,
        agents,
        companyInfo,
        bookings,
        favorites,
        compareList,
        filters,
        addProperty,
        updateProperty,
        deleteProperty,
        addAgent,
        updateAgent,
        deleteAgent,
        updateCompanyInfo,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        toggleFavorite,
        toggleCompare,
        clearCompare,
        setFilters,
        updateFilter,
        resetFilters,
        resetToDefaults,
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
};

export const useRealEstate = () => {
  const context = useContext(RealEstateContext);
  if (!context) {
    throw new Error('useRealEstate must be used within a RealEstateProvider');
  }
  return context;
};
