import React, { useState } from 'react';
import { X, Video, CheckCircle2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const VideoCallModal: React.FC = () => {
  const { isVideoCallModalOpen, setIsVideoCallModalOpen } = useShop();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    timeSlot: '11:00 AM - 12:00 PM',
    interest: 'Pure Paithani Sarees',
    language: 'Marathi'
  });

  if (!isVideoCallModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsVideoCallModalOpen(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 select-none">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsVideoCallModalOpen(false)}
      />

      <div className="relative bg-[#FAF7F2] rounded-xs shadow-2xl max-w-lg w-full overflow-hidden border border-[#D4AF37]/50 z-10 animate-fadeIn">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#3B1366] via-[#53208C] to-[#3B1366] text-[#FAF7F2] flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif text-lg font-medium tracking-wide">
              Bespoke Video Consultation
            </h3>
          </div>
          <button
            onClick={() => setIsVideoCallModalOpen(false)}
            className="p-1 text-[#FAF2DE] hover:text-[#FFFFFF] transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center bg-[#FFFFFF]">
            <div className="w-16 h-16 rounded-full bg-[#097969]/10 text-[#097969] flex items-center justify-center mx-auto mb-4 border border-[#097969]/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#3B1366]">
              Consultation Scheduled!
            </h4>
            <p className="text-xs sm:text-sm text-[#3B1366]/80 mt-2 max-w-sm mx-auto">
              Our master saree curator will reach out to you via WhatsApp at <span className="font-bold text-[#53208C]">{formData.phone || '+91 98220 54321'}</span> on your chosen date.
            </p>
            <p className="text-xs text-[#D4AF37] font-semibold mt-4">
              Thank you for trusting Anandi Sarees.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-[#FFFFFF]">
            <p className="text-xs text-[#3B1366]/80 leading-relaxed">
              Experience the sheen, zari motifs, and drape of authentic Maharashtrian sarees live from our boutique with our specialist drapers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Kulkarni"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                  Time Slot
                </label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                >
                  <option>11:00 AM - 12:00 PM</option>
                  <option>02:00 PM - 03:00 PM</option>
                  <option>04:00 PM - 05:00 PM</option>
                  <option>06:30 PM - 07:30 PM</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                  Saree of Interest
                </label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                >
                  <option>Pure Paithani Sarees</option>
                  <option>Nauvari Bridal Shalu (9 Yards)</option>
                  <option>Narayan Peth Temple Border</option>
                  <option>Pure Silk Handloom Collection</option>
                  <option>Under ₹999 Festive Edit</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                  Consultation Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                >
                  <option>Marathi (मराठी)</option>
                  <option>Hindi (हिन्दी)</option>
                  <option>English</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#53208C] via-[#6B2BAF] to-[#53208C] hover:from-[#3B1366] hover:to-[#53208C] text-[#FAF7F2] text-xs font-semibold py-3 px-4 uppercase tracking-wider transition-colors shadow-xs border border-[#D4AF37]/40"
              >
                Confirm Video Consultation Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
