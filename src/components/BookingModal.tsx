import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext';
import { Property, Agent } from '../types';
import { Calendar, Clock, Video, User, Mail, Phone, CheckCircle, Sparkles, X, Building2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedProperty = null,
}) => {
  const { properties, agents, addBooking } = useRealEstate();

  const [propertyId, setPropertyId] = useState<string>(selectedProperty?.id || (properties[0]?.id ?? ''));
  const activeProperty = properties.find(p => p.id === propertyId) || selectedProperty || properties[0];
  const defaultAgent = agents.find(a => a.id === activeProperty?.agentId) || agents[0];

  const [agentId, setAgentId] = useState<string>(defaultAgent?.id || '');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [tourType, setTourType] = useState<'in-person' | 'video-call'>('in-person');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  if (!isOpen) return null;

  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM',
    '06:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !activeProperty) {
      return;
    }

    const assignedAgent = agents.find(a => a.id === agentId) || defaultAgent;

    const newBooking = addBooking({
      propertyId: activeProperty.id,
      propertyTitle: activeProperty.title,
      agentId: assignedAgent.id,
      agentName: assignedAgent.name,
      clientName,
      clientEmail,
      clientPhone,
      preferredDate,
      preferredTime,
      tourType,
      notes,
    });

    setBookingRef(newBooking.id);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      id="booking-request-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Private VIP Viewing
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-title">
              Schedule a Property Tour
            </h2>
          </div>
          <button
            id="close-booking-modal"
            type="button"
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Confirmation State */
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center ring-8 ring-emerald-50">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-stone-900 font-serif-title">
                Viewing Request Confirmed!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Thank you, <strong className="text-stone-900">{clientName}</strong>. Our designated agent will review your requested slot and contact you shortly with your calendar invitation.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-left space-y-3 max-w-md mx-auto text-xs sm:text-sm">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Booking Reference</span>
                <span className="font-mono font-semibold text-stone-900">{bookingRef}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Property</span>
                <span className="font-semibold text-stone-900 truncate max-w-[200px]">
                  {activeProperty?.title}
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Format & Date</span>
                <span className="font-semibold text-stone-900 capitalize">
                  {tourType === 'in-person' ? 'In-Person Walkthrough' : 'Live Video Tour'} &bull; {preferredDate} at {preferredTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Host Agent</span>
                <span className="font-semibold text-stone-900">
                  {agents.find(a => a.id === agentId)?.name || defaultAgent.name}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                id="finish-booking-btn"
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors shadow-md"
              >
                Return to Properties
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Property Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                Selected Residence or Parcel
              </label>
              <div className="relative">
                <select
                  id="booking-property-select"
                  value={propertyId}
                  onChange={e => {
                    setPropertyId(e.target.value);
                    const prop = properties.find(p => p.id === e.target.value);
                    if (prop?.agentId) setAgentId(prop.agentId);
                  }}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.type.toUpperCase()}] {p.title} - ${p.price.toLocaleString()} ({p.location.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tour Type: In-Person vs Video */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                Tour Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="tour-type-in-person"
                  type="button"
                  onClick={() => setTourType('in-person')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                    tourType === 'in-person'
                      ? 'bg-amber-50/80 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>In-Person Walkthrough</span>
                </button>
                <button
                  id="tour-type-video"
                  type="button"
                  onClick={() => setTourType('video-call')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                    tourType === 'video-call'
                      ? 'bg-amber-50/80 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Video className="w-4 h-4 text-amber-700" />
                  <span>Live HD Video Tour</span>
                </button>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Preferred Date
                </label>
                <div className="relative">
                  <input
                    id="booking-date-input"
                    type="date"
                    required
                    value={preferredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  id="booking-time-select"
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assigned Agent Card */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                Hosting Agent
              </label>
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <img
                  src={defaultAgent.avatar}
                  alt={defaultAgent.name}
                  className="w-11 h-11 rounded-full object-cover border border-stone-300"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-900">{defaultAgent.name}</p>
                  <p className="text-xs text-stone-500 truncate">{defaultAgent.title}</p>
                </div>
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                  {defaultAgent.licenseNumber}
                </span>
              </div>
            </div>

            {/* Client Contact Info */}
            <div className="space-y-3 pt-1 border-t border-stone-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    id="client-name-input"
                    type="text"
                    required
                    placeholder="e.g. Robert Stirling"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="client-phone-input"
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="client-email-input"
                  type="email"
                  required
                  placeholder="your.email@domain.com"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Specific Questions or Accommodations (Optional)
                </label>
                <textarea
                  id="client-notes-textarea"
                  rows={2}
                  placeholder="e.g. Looking to review HOA covenants, interested in closing timeline..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                id="cancel-booking-btn"
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                id="submit-booking-btn"
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm Tour Booking</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
