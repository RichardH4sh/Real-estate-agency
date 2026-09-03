import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { Property, Agent, CompanyInfo, BookingRequest, PropertyType, PropertyStatus } from '../types';
import JSZip from 'jszip';
import {
  Building2,
  Users,
  Briefcase,
  CalendarCheck,
  Download,
  Plus,
  Trash2,
  Edit,
  Save,
  Upload,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  FileArchive,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPropertyForView?: (property: Property) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  onSelectPropertyForView,
}) => {
  const {
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    agents,
    addAgent,
    updateAgent,
    deleteAgent,
    companyInfo,
    updateCompanyInfo,
    bookings,
    updateBookingStatus,
    deleteBooking,
    resetToDefaults,
  } = useRealEstate();

  const [activeTab, setActiveTab] = useState<'properties' | 'agents' | 'company' | 'bookings' | 'export'>('properties');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Property Form State
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propForm, setPropForm] = useState<{
    title: string;
    tagline: string;
    type: PropertyType;
    price: number;
    originalPrice?: number;
    status: PropertyStatus;
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    bedrooms: number;
    bathrooms: number;
    areaSqFt: number;
    lotSizeAcres: number;
    zoning: string;
    garageSpaces: number;
    yearBuilt: number;
    description: string;
    featuresText: string;
    images: string[];
    videoUrl: string;
    agentId: string;
    isFeatured: boolean;
  }>({
    title: '',
    tagline: '',
    type: 'flat',
    price: 1500000,
    status: 'for-sale',
    address: '100 Market Street',
    neighborhood: 'Financial District',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    latitude: 37.791,
    longitude: -122.395,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1400,
    lotSizeAcres: 0.1,
    zoning: 'Residential High Density',
    garageSpaces: 1,
    yearBuilt: 2022,
    description: '',
    featuresText: 'Floor-to-ceiling windows\nPrivate Balcony\nValet Parking\nMiele Appliances',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    agentId: agents[0]?.id || '',
    isFeatured: false,
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  // Agent Form State
  const [isEditingAgent, setIsEditingAgent] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [agentForm, setAgentForm] = useState<Omit<Agent, 'id'>>({
    name: '',
    title: 'Associate Broker',
    specialty: 'Residential Estates',
    phone: '+1 (415) 890-0000',
    email: 'agent@havenhearthrealty.com',
    whatsapp: '+14158900000',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    licenseNumber: 'DRE #02345678',
    experienceYears: 8,
    activeListingsCount: 3,
    bio: 'Dedicated real estate professional committed to white-glove advisory.',
  });

  // Company Form State
  const [companyForm, setCompanyForm] = useState<CompanyInfo>({ ...companyInfo });

  // ZIP generation state
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  if (!isOpen) return null;

  // Property Handlers
  const handleOpenAddProperty = () => {
    setIsEditingProperty(true);
    setEditingPropertyId(null);
    setPropForm({
      title: '',
      tagline: '',
      type: 'flat',
      price: 1200000,
      status: 'for-sale',
      address: '',
      neighborhood: '',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      latitude: 37.7749,
      longitude: -122.4194,
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1250,
      lotSizeAcres: 0.1,
      zoning: 'Residential',
      garageSpaces: 1,
      yearBuilt: 2023,
      description: '',
      featuresText: 'High Ceilings\nHardwood Floors\nDesigner Kitchen',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ],
      videoUrl: '',
      agentId: agents[0]?.id || '',
      isFeatured: false,
    });
  };

  const handleOpenEditProperty = (prop: Property) => {
    setIsEditingProperty(true);
    setEditingPropertyId(prop.id);
    setPropForm({
      title: prop.title,
      tagline: prop.tagline,
      type: prop.type,
      price: prop.price,
      originalPrice: prop.originalPrice,
      status: prop.status,
      address: prop.location.address,
      neighborhood: prop.location.neighborhood,
      city: prop.location.city,
      state: prop.location.state,
      zipCode: prop.location.zipCode,
      latitude: prop.location.latitude,
      longitude: prop.location.longitude,
      bedrooms: prop.specs.bedrooms,
      bathrooms: prop.specs.bathrooms,
      areaSqFt: prop.specs.areaSqFt,
      lotSizeAcres: prop.specs.lotSizeAcres || 0.1,
      zoning: prop.specs.zoning || '',
      garageSpaces: prop.specs.garageSpaces || 1,
      yearBuilt: prop.specs.yearBuilt || 2020,
      description: prop.description,
      featuresText: prop.features.join('\n'),
      images: [...prop.images],
      videoUrl: prop.videoUrl || '',
      agentId: prop.agentId,
      isFeatured: !!prop.isFeatured,
    });
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const features = propForm.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const propPayload = {
      title: propForm.title || 'Untitled Property',
      tagline: propForm.tagline,
      type: propForm.type,
      price: Number(propForm.price),
      originalPrice: propForm.originalPrice ? Number(propForm.originalPrice) : undefined,
      status: propForm.status,
      isFeatured: propForm.isFeatured,
      location: {
        address: propForm.address,
        neighborhood: propForm.neighborhood,
        city: propForm.city,
        state: propForm.state,
        zipCode: propForm.zipCode,
        latitude: Number(propForm.latitude) || 37.7749,
        longitude: Number(propForm.longitude) || -122.4194,
      },
      specs: {
        bedrooms: Number(propForm.bedrooms),
        bathrooms: Number(propForm.bathrooms),
        areaSqFt: Number(propForm.areaSqFt),
        lotSizeAcres: Number(propForm.lotSizeAcres),
        garageSpaces: Number(propForm.garageSpaces),
        yearBuilt: Number(propForm.yearBuilt),
        zoning: propForm.zoning,
      },
      images: propForm.images.length > 0 ? propForm.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      videoUrl: propForm.videoUrl,
      description: propForm.description,
      features,
      neighborhoodPOIs: [
        { name: 'City Center & Transit', category: 'transit' as const, distance: '0.4 miles (8 min walk)', coords: { x: 40, y: 35 } },
        { name: 'District Public Park', category: 'park' as const, distance: '0.2 miles (4 min walk)', coords: { x: 65, y: 55 } },
        { name: 'Fine Dining & Grocers', category: 'shopping' as const, distance: '0.3 miles (5 min walk)', coords: { x: 50, y: 70 } },
      ],
      agentId: propForm.agentId || agents[0]?.id || 'agent-1',
    };

    if (editingPropertyId) {
      const existing = properties.find(p => p.id === editingPropertyId);
      if (existing) {
        updateProperty({
          ...existing,
          ...propPayload,
          id: editingPropertyId,
        });
        showToast('Property updated successfully!');
      }
    } else {
      addProperty(propPayload);
      showToast('New property listing published!');
    }

    setIsEditingProperty(false);
  };

  // Image Upload handler (File -> Base64 data URI)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPropForm(prev => ({
            ...prev,
            images: [...prev.images, String(reader.result)],
          }));
          showToast(`Photo "${file.name}" uploaded!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setPropForm(prev => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()],
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (idx: number) => {
    setPropForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // Agent Handlers
  const handleOpenAddAgent = () => {
    setIsEditingAgent(true);
    setEditingAgentId(null);
    setAgentForm({
      name: '',
      title: 'Real Estate Advisor',
      specialty: 'Luxury Residential',
      phone: '+1 (415) 890-0000',
      email: 'new.agent@havenhearthrealty.com',
      whatsapp: '+14158900000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      licenseNumber: 'DRE #02998877',
      experienceYears: 5,
      activeListingsCount: 2,
      bio: 'Energetic real estate partner focused on client success and market precision.',
    });
  };

  const handleOpenEditAgent = (agent: Agent) => {
    setIsEditingAgent(true);
    setEditingAgentId(agent.id);
    setAgentForm({
      name: agent.name,
      title: agent.title,
      specialty: agent.specialty,
      phone: agent.phone,
      email: agent.email,
      whatsapp: agent.whatsapp || '',
      avatar: agent.avatar,
      licenseNumber: agent.licenseNumber,
      experienceYears: agent.experienceYears,
      activeListingsCount: agent.activeListingsCount || 0,
      bio: agent.bio,
    });
  };

  const handleSaveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentForm.name) return;

    if (editingAgentId) {
      updateAgent({
        ...agentForm,
        id: editingAgentId,
      });
      showToast('Agent contact information updated!');
    } else {
      addAgent(agentForm);
      showToast('New agent added to the team!');
    }
    setIsEditingAgent(false);
  };

  const handleAgentAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setAgentForm(prev => ({ ...prev, avatar: String(reader.result) }));
        showToast('Agent portrait uploaded!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Company Save
  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo(companyForm);
    showToast('Company profile & contact data updated!');
  };

  // Generate & Download ZIP Package directly in browser
  const handleDownloadZipPackage = async () => {
    setIsGeneratingZip(true);
    try {
      const zip = new JSZip();

      // Create a self-contained production deployable distribution
      // Include index.html, styles, json data, and readme
      const staticExportHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${companyInfo.name} - Real Estate Agency</title>
  <meta name="description" content="${companyInfo.slogan}" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; color: #1e293b; }
    h1, h2, h3 { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="p-6 md:p-12 max-w-7xl mx-auto">
  <header class="border-b pb-6 mb-8 flex flex-wrap justify-between items-center gap-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">${companyInfo.name}</h1>
      <p class="text-sm text-gray-600 mt-1">${companyInfo.slogan}</p>
    </div>
    <div class="text-sm text-right text-gray-600">
      <p class="font-semibold text-gray-900">${companyInfo.phone}</p>
      <p>${companyInfo.email}</p>
      <p class="text-xs text-gray-500">${companyInfo.address}, ${companyInfo.city}</p>
    </div>
  </header>

  <main>
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Available Properties (${properties.length})</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${properties
          .map(
            p => `
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <img src="${p.images[0]}" alt="${p.title}" class="w-full h-56 object-cover" />
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span class="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full uppercase">${p.type}</span>
                <h3 class="text-lg font-bold text-gray-900 mt-2">${p.title}</h3>
                <p class="text-xl font-bold text-amber-700 mt-1">$${p.price.toLocaleString()}</p>
                <p class="text-xs text-gray-500 mt-1">${p.location.neighborhood}, ${p.location.city}</p>
                <p class="text-xs text-gray-600 mt-3 line-clamp-2">${p.description}</p>
              </div>
              <div class="mt-4 pt-4 border-t text-xs text-gray-500 flex justify-between">
                <span>${p.type === 'land' ? `${p.specs.lotSizeAcres} Acres` : `${p.specs.bedrooms} Beds &bull; ${p.specs.bathrooms} Baths`}</span>
                <span>${p.specs.areaSqFt ? `${p.specs.areaSqFt} sqft` : 'Parcel'}</span>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>

    <div class="mt-12 pt-8 border-t">
      <h2 class="text-2xl font-bold mb-4">Our Real Estate Advisors</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        ${agents
          .map(
            a => `
          <div class="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <img src="${a.avatar}" alt="${a.name}" class="w-16 h-16 rounded-full mx-auto object-cover mb-2" />
            <h4 class="font-bold text-gray-900 text-sm">${a.name}</h4>
            <p class="text-xs text-gray-500">${a.title}</p>
            <p class="text-xs text-amber-700 font-semibold mt-1">${a.phone}</p>
            <p class="text-xs text-gray-400">${a.email}</p>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  </main>

  <footer class="mt-16 pt-8 border-t text-center text-xs text-gray-500">
    <p>&copy; ${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.</p>
  </footer>
</body>
</html>`;

      zip.file('index.html', staticExportHtml);

      // JSON Data exports for backup or database loading
      const dataFolder = zip.folder('data');
      if (dataFolder) {
        dataFolder.file('properties.json', JSON.stringify(properties, null, 2));
        dataFolder.file('agents.json', JSON.stringify(agents, null, 2));
        dataFolder.file('company.json', JSON.stringify(companyInfo, null, 2));
        dataFolder.file('bookings.json', JSON.stringify(bookings, null, 2));
      }

      // Deployment guide README
      const readmeText = `# ${companyInfo.name} - Web Deployment Package

This ZIP contains the complete real estate agency application package ready for upload to any web hosting service (such as Netlify, Vercel, cPanel, Apache, Nginx, or GitHub Pages).

## Quick Upload Instructions:
1. **cPanel / Apache / Nginx / Shared Hosting:**
   - Unzip this archive into your \`public_html\` directory.
   - Access your domain!

2. **Netlify Drop:**
   - Drag and drop this folder or ZIP onto https://app.netlify.com/drop

3. **Vercel / GitHub Pages:**
   - Push these files or upload to your web root.

Generated on: ${new Date().toLocaleString()}
`;
      zip.file('README.txt', readmeText);

      // Trigger download
      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `haven_hearth_real_estate_site_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      showToast('Deployment ZIP downloaded successfully!');
    } catch (err) {
      console.error('Failed to generate ZIP', err);
      showToast('Error generating ZIP package.');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div
      id="admin-portal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-2 sm:p-4 lg:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[94vh] animate-in fade-in duration-200">
        {/* Admin Navigation Bar */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Agency Management Portal</h2>
              <p className="text-xs text-stone-400">
                {companyInfo.name} &bull; Properties, Agents, Media & Bookings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="admin-download-zip-btn"
              type="button"
              onClick={handleDownloadZipPackage}
              disabled={isGeneratingZip}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {isGeneratingZip ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isGeneratingZip ? 'Compiling ZIP...' : 'Download Site ZIP'}</span>
            </button>

            <button
              id="close-admin-portal-btn"
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast Notification */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-medium flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)}>✕</button>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="bg-stone-100/90 border-b border-stone-200 px-6 flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
          <button
            id="admin-tab-properties"
            type="button"
            onClick={() => {
              setActiveTab('properties');
              setIsEditingProperty(false);
            }}
            className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'properties'
                ? 'border-amber-600 text-amber-800 bg-white shadow-2xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Properties Catalog ({properties.length})</span>
          </button>

          <button
            id="admin-tab-agents"
            type="button"
            onClick={() => {
              setActiveTab('agents');
              setIsEditingAgent(false);
            }}
            className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'agents'
                ? 'border-amber-600 text-amber-800 bg-white shadow-2xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Agent Contacts ({agents.length})</span>
          </button>

          <button
            id="admin-tab-company"
            type="button"
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'company'
                ? 'border-amber-600 text-amber-800 bg-white shadow-2xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Company Profile & Media</span>
          </button>

          <button
            id="admin-tab-bookings"
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-amber-600 text-amber-800 bg-white shadow-2xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Tour Inquiries ({bookings.length})</span>
            {bookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            id="admin-tab-export"
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'export'
                ? 'border-amber-600 text-amber-800 bg-white shadow-2xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileArchive className="w-4 h-4" />
            <span>Deployment & Hosting (.ZIP)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-stone-50/40">
          {/* TAB 1: PROPERTIES MANAGEMENT */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              {!isEditingProperty ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 font-serif-title">
                        Manage Listings (Flats, Houses, Lands)
                      </h3>
                      <p className="text-xs text-stone-500">
                        Add high-quality photo galleries, video tours, specs, and assign agents.
                      </p>
                    </div>

                    <button
                      id="add-new-property-btn"
                      type="button"
                      onClick={handleOpenAddProperty}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Listing</span>
                    </button>
                  </div>

                  {/* Properties Table / Grid */}
                  <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-stone-500 font-semibold">
                        <tr>
                          <th className="p-3.5">Listing</th>
                          <th className="p-3.5">Type</th>
                          <th className="p-3.5">Price</th>
                          <th className="p-3.5">Key Specs</th>
                          <th className="p-3.5">Assigned Agent</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {properties.map(p => {
                          const assigned = agents.find(a => a.id === p.agentId);
                          return (
                            <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.images[0]}
                                    alt={p.title}
                                    className="w-12 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-stone-900 truncate max-w-xs">{p.title}</p>
                                    <p className="text-stone-400 text-[11px] truncate">
                                      {p.location.neighborhood}, {p.location.city}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                                  {p.type}
                                </span>
                              </td>
                              <td className="p-3.5 font-bold text-stone-900">
                                ${p.price.toLocaleString()}
                              </td>
                              <td className="p-3.5 text-stone-600">
                                {p.type === 'land'
                                  ? `${p.specs.lotSizeAcres} Acres`
                                  : `${p.specs.bedrooms}b / ${p.specs.bathrooms}ba &bull; ${p.specs.areaSqFt} sqft`}
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={assigned?.avatar || agents[0]?.avatar}
                                    alt=""
                                    className="w-6 h-6 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="text-stone-800 font-medium truncate max-w-[120px]">
                                    {assigned?.name || 'Unassigned'}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    id={`edit-prop-${p.id}`}
                                    type="button"
                                    onClick={() => handleOpenEditProperty(p)}
                                    className="p-1.5 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-stone-100"
                                    title="Edit property"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    id={`delete-prop-${p.id}`}
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Delete listing "${p.title}"?`)) {
                                        deleteProperty(p.id);
                                        showToast('Property deleted');
                                      }
                                    }}
                                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                                    title="Delete property"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                /* Property Edit / Add Form */
                <form onSubmit={handleSaveProperty} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <h3 className="text-base font-bold text-stone-900 font-serif-title">
                      {editingPropertyId ? 'Edit Property Listing' : 'Create New Property Listing'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingProperty(false)}
                      className="text-xs text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div className="lg:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Listing Title *</label>
                      <input
                        type="text"
                        required
                        value={propForm.title}
                        onChange={e => setPropForm({ ...propForm, title: e.target.value })}
                        placeholder="e.g. Modern Marina View Penthouse"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Property Type *</label>
                      <select
                        value={propForm.type}
                        onChange={e => setPropForm({ ...propForm, type: e.target.value as PropertyType })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="flat">Flat / Apartment</option>
                        <option value="house">House / Villa</option>
                        <option value="land">Land / Parcel</option>
                      </select>
                    </div>

                    <div className="lg:col-span-3">
                      <label className="block font-semibold text-stone-700 mb-1">Tagline / Catchphrase</label>
                      <input
                        type="text"
                        value={propForm.tagline}
                        onChange={e => setPropForm({ ...propForm, tagline: e.target.value })}
                        placeholder="e.g. Private wrap-around terrace with panoramic sunrise views"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Asking Price ($) *</label>
                      <input
                        type="number"
                        required
                        value={propForm.price}
                        onChange={e => setPropForm({ ...propForm, price: Number(e.target.value) })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Original Price ($) (Optional)</label>
                      <input
                        type="number"
                        value={propForm.originalPrice || ''}
                        onChange={e => setPropForm({ ...propForm, originalPrice: Number(e.target.value) || undefined })}
                        placeholder="For price-drop badge"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Listing Status</label>
                      <select
                        value={propForm.status}
                        onChange={e => setPropForm({ ...propForm, status: e.target.value as PropertyStatus })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="for-sale">For Sale</option>
                        <option value="featured">Featured / Exclusive</option>
                        <option value="price-drop">Price Drop</option>
                        <option value="pending">Pending</option>
                        <option value="sold">Sold</option>
                      </select>
                    </div>

                    {/* Location fields */}
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={propForm.address}
                        onChange={e => setPropForm({ ...propForm, address: e.target.value })}
                        placeholder="123 Oak Street"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Neighborhood</label>
                      <input
                        type="text"
                        value={propForm.neighborhood}
                        onChange={e => setPropForm({ ...propForm, neighborhood: e.target.value })}
                        placeholder="Pacific Heights"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">City & State</label>
                      <input
                        type="text"
                        value={propForm.city}
                        onChange={e => setPropForm({ ...propForm, city: e.target.value })}
                        placeholder="San Francisco"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Specifications */}
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Bedrooms</label>
                      <input
                        type="number"
                        value={propForm.bedrooms}
                        onChange={e => setPropForm({ ...propForm, bedrooms: Number(e.target.value) })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Bathrooms</label>
                      <input
                        type="number"
                        step="0.5"
                        value={propForm.bathrooms}
                        onChange={e => setPropForm({ ...propForm, bathrooms: Number(e.target.value) })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        {propForm.type === 'land' ? 'Lot Size (Acres)' : 'Area (Sq Ft)'}
                      </label>
                      <input
                        type="number"
                        value={propForm.type === 'land' ? propForm.lotSizeAcres : propForm.areaSqFt}
                        onChange={e => {
                          const val = Number(e.target.value);
                          if (propForm.type === 'land') {
                            setPropForm({ ...propForm, lotSizeAcres: val });
                          } else {
                            setPropForm({ ...propForm, areaSqFt: val });
                          }
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Assigned Agent *</label>
                      <select
                        value={propForm.agentId}
                        onChange={e => setPropForm({ ...propForm, agentId: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        {agents.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.title})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Video Tour Link / Embed URL</label>
                      <input
                        type="text"
                        value={propForm.videoUrl}
                        onChange={e => setPropForm({ ...propForm, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* High Quality Photo Upload & Gallery Manager */}
                  <div className="space-y-3 pt-3 border-t border-stone-100">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                          Photo Gallery ({propForm.images.length} Images)
                        </h4>
                        <p className="text-[11px] text-stone-400">
                          Upload high-resolution files from your device or paste web image URLs.
                        </p>
                      </div>

                      {/* File upload button */}
                      <label className="cursor-pointer bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Images from Device</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* URL adder */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Or paste direct image URL (https://...)"
                        value={newImageUrl}
                        onChange={e => setNewImageUrl(e.target.value)}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold"
                      >
                        Add URL
                      </button>
                    </div>

                    {/* Image thumbnails manager */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {propForm.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group aspect-video rounded-xl overflow-hidden border border-stone-200 bg-stone-100"
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-stone-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-xs"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-amber-600 text-white px-1.5 py-0.5 rounded">
                              Cover Photo
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description & Features */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-3 border-t border-stone-100 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Full Property Narrative / Description
                      </label>
                      <textarea
                        rows={4}
                        value={propForm.description}
                        onChange={e => setPropForm({ ...propForm, description: e.target.value })}
                        placeholder="Describe the architectural details, materials, natural light, and lifestyle benefits..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Highlights & Amenities (One per line)
                      </label>
                      <textarea
                        rows={4}
                        value={propForm.featuresText}
                        onChange={e => setPropForm({ ...propForm, featuresText: e.target.value })}
                        placeholder="Private Heated Lap Pool&#10;Gourmet Sub-Zero Kitchen&#10;Panoramic Ocean Views"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setIsEditingProperty(false)}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingPropertyId ? 'Save Changes' : 'Publish Property'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: AGENT CONTACT INFORMATION MANAGEMENT */}
          {activeTab === 'agents' && (
            <div className="space-y-6">
              {!isEditingAgent ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 font-serif-title">
                        Agent Team & Contact Information
                      </h3>
                      <p className="text-xs text-stone-500">
                        Update direct phone numbers, email addresses, WhatsApp lines, and photo portraits seamlessly.
                      </p>
                    </div>

                    <button
                      id="add-new-agent-btn"
                      type="button"
                      onClick={handleOpenAddAgent}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Agent</span>
                    </button>
                  </div>

                  {/* Agents Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agents.map(a => (
                      <div
                        key={a.id}
                        className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={a.avatar}
                            alt={a.name}
                            className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-2xs shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-base font-bold text-stone-900 truncate">{a.name}</h4>
                              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                                {a.licenseNumber}
                              </span>
                            </div>
                            <p className="text-xs text-amber-700 font-semibold">{a.title}</p>
                            <p className="text-xs text-stone-500 mt-0.5 truncate">{a.specialty}</p>
                          </div>
                        </div>

                        {/* Contact details list */}
                        <div className="bg-stone-50 rounded-xl p-3 space-y-1.5 text-xs text-stone-700">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span className="font-semibold">{a.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span className="truncate">{a.email}</span>
                          </div>
                          {a.whatsapp && (
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>WhatsApp: {a.whatsapp}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-2">{a.bio}</p>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                          <button
                            id={`edit-agent-${a.id}`}
                            type="button"
                            onClick={() => handleOpenEditAgent(a)}
                            className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 flex items-center gap-1.5"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Contact Info</span>
                          </button>
                          {agents.length > 1 && (
                            <button
                              id={`delete-agent-${a.id}`}
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove agent "${a.name}"?`)) {
                                  deleteAgent(a.id);
                                  showToast('Agent removed');
                                }
                              }}
                              className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Edit Agent Form */
                <form onSubmit={handleSaveAgent} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <h3 className="text-base font-bold text-stone-900 font-serif-title">
                      {editingAgentId ? 'Update Agent Contact Information' : 'Add New Real Estate Agent'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingAgent(false)}
                      className="text-xs text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={agentForm.name}
                        onChange={e => setAgentForm({ ...agentForm, name: e.target.value })}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Job Title *</label>
                      <input
                        type="text"
                        required
                        value={agentForm.title}
                        onChange={e => setAgentForm({ ...agentForm, title: e.target.value })}
                        placeholder="e.g. Senior Partner & Waterfront Specialist"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Specialty Domain</label>
                      <input
                        type="text"
                        value={agentForm.specialty}
                        onChange={e => setAgentForm({ ...agentForm, specialty: e.target.value })}
                        placeholder="e.g. Waterfront Estates & Penthouses"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Direct Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={agentForm.phone}
                        onChange={e => setAgentForm({ ...agentForm, phone: e.target.value })}
                        placeholder="+1 (415) 890-0000"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Business Email *</label>
                      <input
                        type="email"
                        required
                        value={agentForm.email}
                        onChange={e => setAgentForm({ ...agentForm, email: e.target.value })}
                        placeholder="agent@havenhearthrealty.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">WhatsApp Contact (Optional)</label>
                      <input
                        type="text"
                        value={agentForm.whatsapp || ''}
                        onChange={e => setAgentForm({ ...agentForm, whatsapp: e.target.value })}
                        placeholder="+14158900000"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">DRE License Number</label>
                      <input
                        type="text"
                        value={agentForm.licenseNumber}
                        onChange={e => setAgentForm({ ...agentForm, licenseNumber: e.target.value })}
                        placeholder="DRE #01928374"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Experience (Years)</label>
                      <input
                        type="number"
                        value={agentForm.experienceYears}
                        onChange={e => setAgentForm({ ...agentForm, experienceYears: Number(e.target.value) })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block font-semibold text-stone-700 mb-1">Agent Portrait Picture</label>
                      <div className="flex items-center gap-4">
                        <img
                          src={agentForm.avatar}
                          alt="Avatar preview"
                          className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="url"
                            value={agentForm.avatar}
                            onChange={e => setAgentForm({ ...agentForm, avatar: e.target.value })}
                            placeholder="Image URL (https://...)"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900"
                          />
                          <label className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-semibold cursor-pointer hover:underline">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Or Upload Portrait From Computer</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAgentAvatarUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block font-semibold text-stone-700 mb-1">Agent Biography</label>
                      <textarea
                        rows={3}
                        value={agentForm.bio}
                        onChange={e => setAgentForm({ ...agentForm, bio: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setIsEditingAgent(false)}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Agent Profile</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: COMPANY DATA & SETTINGS */}
          {activeTab === 'company' && (
            <form onSubmit={handleSaveCompany} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-xs">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-lg font-bold text-stone-900 font-serif-title">
                  Agency Profile & Corporate Contact Details
                </h3>
                <p className="text-xs text-stone-500">
                  Manage agency name, head office location, phone lines, social presence, and trust metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Agency Name *</label>
                  <input
                    type="text"
                    required
                    value={companyForm.name}
                    onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Brand Slogan / Mission</label>
                  <input
                    type="text"
                    value={companyForm.slogan}
                    onChange={e => setCompanyForm({ ...companyForm, slogan: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Primary Concierge Phone</label>
                  <input
                    type="tel"
                    value={companyForm.phone}
                    onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Emergency / VIP Line</label>
                  <input
                    type="tel"
                    value={companyForm.emergencyPhone}
                    onChange={e => setCompanyForm({ ...companyForm, emergencyPhone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Public Inquiries Email</label>
                  <input
                    type="email"
                    value={companyForm.email}
                    onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Headquarters Street Address</label>
                  <input
                    type="text"
                    value={companyForm.address}
                    onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">City, State & Zip</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={companyForm.city}
                      onChange={e => setCompanyForm({ ...companyForm, city: e.target.value })}
                      placeholder="City"
                      className="w-1/2 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-stone-900"
                    />
                    <input
                      type="text"
                      value={companyForm.state}
                      onChange={e => setCompanyForm({ ...companyForm, state: e.target.value })}
                      placeholder="State"
                      className="w-1/4 bg-stone-50 border border-stone-200 rounded-xl px-2 py-2 text-stone-900"
                    />
                    <input
                      type="text"
                      value={companyForm.zipCode}
                      onChange={e => setCompanyForm({ ...companyForm, zipCode: e.target.value })}
                      placeholder="Zip"
                      className="w-1/4 bg-stone-50 border border-stone-200 rounded-xl px-2 py-2 text-stone-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-semibold text-stone-700 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={companyForm.officeHours}
                    onChange={e => setCompanyForm({ ...companyForm, officeHours: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Stats Counters */}
              <div className="pt-3 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                  Company Proven Track Record Statistics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-500 mb-1">Closed Transactions</label>
                    <input
                      type="number"
                      value={companyForm.stats.propertiesSold}
                      onChange={e =>
                        setCompanyForm({
                          ...companyForm,
                          stats: { ...companyForm.stats, propertiesSold: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Families Served</label>
                    <input
                      type="number"
                      value={companyForm.stats.happyFamilies}
                      onChange={e =>
                        setCompanyForm({
                          ...companyForm,
                          stats: { ...companyForm.stats, happyFamilies: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Years in Industry</label>
                    <input
                      type="number"
                      value={companyForm.stats.yearsInBusiness}
                      onChange={e =>
                        setCompanyForm({
                          ...companyForm,
                          stats: { ...companyForm.stats, yearsInBusiness: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Licensed Agents</label>
                    <input
                      type="number"
                      value={companyForm.stats.agentsCount}
                      onChange={e =>
                        setCompanyForm({
                          ...companyForm,
                          stats: { ...companyForm.stats, agentsCount: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Company Information</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: TOUR BOOKINGS MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif-title">
                    Viewing Tour Bookings & VIP Requests ({bookings.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Live schedule of requested property tours submitted by website visitors.
                  </p>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 text-xs">
                  No tour inquiries submitted yet. Booking requests will appear here in real time.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-stone-500 font-semibold">
                      <tr>
                        <th className="p-3.5">Client & Contact</th>
                        <th className="p-3.5">Requested Property</th>
                        <th className="p-3.5">Date & Time Slot</th>
                        <th className="p-3.5">Assigned Agent</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="p-3.5">
                            <p className="font-bold text-stone-900">{b.clientName}</p>
                            <p className="text-stone-500">{b.clientEmail}</p>
                            <p className="text-stone-400 font-mono text-[11px]">{b.clientPhone}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-medium text-stone-900 max-w-xs truncate">{b.propertyTitle}</p>
                            <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {b.tourType === 'in-person' ? 'In-Person Tour' : 'Video Call'}
                            </span>
                            {b.notes && (
                              <p className="text-[11px] text-stone-500 italic mt-1 max-w-xs truncate">
                                "{b.notes}"
                              </p>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5 font-medium text-stone-900">
                              <CalendarCheck className="w-3.5 h-3.5 text-amber-700" />
                              <span>{b.preferredDate}</span>
                            </div>
                            <span className="text-stone-500 text-[11px] block mt-0.5">
                              {b.preferredTime}
                            </span>
                          </td>
                          <td className="p-3.5 font-medium text-stone-800">
                            {b.agentName}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={b.status}
                              onChange={e => updateBookingStatus(b.id, e.target.value as any)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : b.status === 'pending'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : b.status === 'completed'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-stone-100 text-stone-600 border-stone-300'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              id={`delete-booking-${b.id}`}
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove booking for ${b.clientName}?`)) {
                                  deleteBooking(b.id);
                                  showToast('Booking deleted');
                                }
                              }}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: DEPLOYMENT & ZIP EXPORT */}
          {activeTab === 'export' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl mx-auto">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <FileArchive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif-title">
                    Deploy Anywhere & Export Website (.ZIP)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Your real estate portal is fully compiled and ready to upload to any external web hosting service.
                  </p>
                </div>
              </div>

              {/* Main Download Callout */}
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-stone-900">
                    Download Full Production Package (.zip)
                  </h4>
                  <p className="text-xs text-stone-600">
                    Includes all compiled assets, active listings ({properties.length}), photo references, agent contacts, and documentation.
                  </p>
                </div>

                <button
                  id="zip-tab-download-btn"
                  type="button"
                  onClick={handleDownloadZipPackage}
                  disabled={isGeneratingZip}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isGeneratingZip ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{isGeneratingZip ? 'Packaging Files...' : 'Download Production ZIP'}</span>
                </button>
              </div>

              {/* Instructions Guide */}
              <div className="space-y-3 text-xs text-stone-700">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  How to Upload to Your External Web Host:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <li>
                    <strong className="text-stone-800">Direct Drag & Drop on Netlify:</strong> Visit{' '}
                    <span className="font-mono text-amber-800">app.netlify.com/drop</span> and drag the extracted folder or ZIP to go live in 10 seconds.
                  </li>
                  <li>
                    <strong className="text-stone-800">cPanel / Apache / Nginx / Shared Hosting:</strong> Open your cPanel File Manager, enter <span className="font-mono text-amber-800">public_html</span>, and extract the ZIP contents there.
                  </li>
                  <li>
                    <strong className="text-stone-800">Vercel or GitHub Pages:</strong> Connect your repository or run <span className="font-mono text-amber-800">vercel deploy</span>.
                  </li>
                </ol>
              </div>

              {/* Reset to initial sample data */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-stone-900">Restore Factory Seed Data</h5>
                  <p className="text-[11px] text-stone-400">
                    Reset properties, agents, and bookings back to initial defaults.
                  </p>
                </div>
                <button
                  id="reset-factory-btn"
                  type="button"
                  onClick={() => {
                    if (confirm('Reset all listings and agent data back to factory defaults?')) {
                      resetToDefaults();
                      showToast('App reset to initial sample data.');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 text-stone-700 hover:text-rose-600 hover:border-rose-300 text-xs font-semibold transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
