import React from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { Building2, Phone, Mail, MapPin, Clock, ShieldCheck, Download, Settings, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onDownloadZip: () => void;
  onSelectCategory: (type: 'flat' | 'house' | 'land') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onDownloadZip,
  onSelectCategory,
}) => {
  const { companyInfo } = useRealEstate();

  return (
    <footer className="bg-stone-950 text-stone-300 pt-14 pb-10 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif-title">
                {companyInfo.name}
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              {companyInfo.slogan}. Specializing in modern architectural flats, family luxury estates, and prime residential & commercial development parcels.
            </p>
            <div className="flex items-center gap-4 text-stone-400 text-xs pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Equal Housing Opportunity</span>
              </span>
            </div>
          </div>

          {/* Quick Properties Nav */}
          <div className="space-y-3">
            <h4 className="text-stone-100 font-bold uppercase tracking-wider text-[11px]">
              Properties Portfolio
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('flat')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Flats & Condominiums
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('house')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Houses & Waterfront Villas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('land')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Development Lands & Parcels
                </button>
              </li>
              <li>
                <span className="text-stone-600 block">Vineyard & Equestrian Parcels</span>
              </li>
            </ul>
          </div>

          {/* Concierge & Office Info */}
          <div className="space-y-3">
            <h4 className="text-stone-100 font-bold uppercase tracking-wider text-[11px]">
              Headquarters
            </h4>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {companyInfo.address}, {companyInfo.city}, {companyInfo.state} {companyInfo.zipCode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{companyInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{companyInfo.email}</span>
              </div>
              <div className="flex items-start gap-2 pt-1 text-[11px] text-stone-400">
                <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>{companyInfo.officeHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Management & Deploy Tools */}
          <div className="space-y-3">
            <h4 className="text-stone-100 font-bold uppercase tracking-wider text-[11px]">
              Agency Portal & Export
            </h4>
            <div className="space-y-2 text-stone-400">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Management</span>
                </div>
                <span>&rarr;</span>
              </button>

              <button
                type="button"
                onClick={onDownloadZip}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Site ZIP</span>
                </div>
                <span>&darr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-stone-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>
            &copy; {new Date().getFullYear()} {companyInfo.name}. All trademarks and architectural photography belong to their respective creators.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Representation</span>
            <span>&bull;</span>
            <span className="hover:text-stone-400 cursor-pointer">Fair Housing Pledge</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
