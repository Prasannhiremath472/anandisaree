import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Video, CheckCircle2 } from 'lucide-react';
import { EthnicBorderStrip } from '../../components/decorative/EthnicBorderStrip';
import { useShop } from '../../context/ShopContext';

export const ContactPage: React.FC = () => {
  const { setIsVideoCallModalOpen } = useShop();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inquiryType: 'Bridal Saree Consultation',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', inquiryType: 'Bridal Saree Consultation', message: '' });
    }, 5000);
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3B1366] via-[#53208C] to-[#3B1366] text-[#FAF7F2] py-12 sm:py-16 text-center border-b border-[#D4AF37]/40">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">
            Get In Touch With Anandi
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-wide">
            Boutique Locations & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-[#FAF2DE] mt-2 font-light max-w-xl mx-auto">
            Whether visiting our flagship boutiques in Pune and Mumbai or connecting virtually over video call, our saree curators await your presence.
          </p>
        </div>
      </div>

      <EthnicBorderStrip variant="geometric" color="#D4AF37" className="border-b border-[#D4AF37]/30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info & Boutique Locations (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Connect Box */}
            <div className="bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xs p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#3B1366]">
                Direct Contact
              </h3>

              <div className="space-y-3 text-xs text-[#3B1366]">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#53208C] shrink-0" />
                  <div>
                    <span className="font-semibold block text-[#3B1366]">Customer Care Helpline</span>
                    <a href="tel:+919822054321" className="hover:underline hover:text-[#53208C]">+91 98220 54321 / +91 20 2445 6789</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-[#097969] shrink-0" />
                  <div>
                    <span className="font-semibold block text-[#3B1366]">WhatsApp Saree Specialist</span>
                    <a href="https://wa.me/919822054321" target="_blank" rel="noreferrer" className="text-[#097969] font-medium hover:underline">
                      Chat Live (+91 98220 54321)
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#53208C] shrink-0" />
                  <div>
                    <span className="font-semibold block text-[#3B1366]">Email Desk</span>
                    <a href="mailto:care@anandisarees.com" className="hover:underline hover:text-[#53208C]">care@anandisarees.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-[#FAF7F2]">
                  <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="font-semibold block text-[#3B1366]">Boutique Hours</span>
                    <p className="text-[11px] text-[#3B1366]/80">Monday to Saturday: 10:30 AM – 8:00 PM IST</p>
                  </div>
                </div>
              </div>

              {/* Video Call Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsVideoCallModalOpen(true)}
                  className="w-full bg-gradient-to-r from-[#53208C] via-[#6B2BAF] to-[#53208C] hover:from-[#3B1366] hover:to-[#53208C] text-[#FAF7F2] text-xs font-semibold py-2.5 px-4 rounded-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-[#D4AF37]/40 shadow-xs"
                >
                  <Video className="w-4 h-4 text-[#D4AF37]" />
                  <span>Book Video Shopping Call</span>
                </button>
              </div>
            </div>

            {/* Boutique Addresses */}
            <div className="bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xs p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#3B1366]">
                Our Flagship Boutiques
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-2.5 pb-3 border-b border-[#FAF7F2]">
                  <MapPin className="w-4 h-4 text-[#53208C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-sm text-[#3B1366] block">Pune Flagship Boutique</span>
                    <p className="text-xs text-[#3B1366]/80 mt-0.5 leading-relaxed">
                      742 Laxmi Road, Sadashiv Peth, Pune, Maharashtra 411030
                    </p>
                    <span className="text-[11px] text-[#D4AF37] font-semibold block mt-1">Open 7 Days • Valet Parking Available</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pb-3 border-b border-[#FAF7F2]">
                  <MapPin className="w-4 h-4 text-[#53208C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-sm text-[#3B1366] block">Mumbai Experience Studio</span>
                    <p className="text-xs text-[#3B1366]/80 mt-0.5 leading-relaxed">
                      Ranade Road, Dadar West, Mumbai, Maharashtra 400028
                    </p>
                    <span className="text-[11px] text-[#D4AF37] font-semibold block mt-1">By Prior Appointment Recommended</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#53208C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-sm text-[#3B1366] block">Yeola Handloom Heritage Center</span>
                    <p className="text-xs text-[#3B1366]/80 mt-0.5 leading-relaxed">
                      Yeola Pit-Loom Weavers Colony, Nashik District, Maharashtra 423401
                    </p>
                    <span className="text-[11px] text-[#D4AF37] font-semibold block mt-1">Direct Weaving & Master Artisan Workshop</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Message & Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xs p-6 sm:p-8 shadow-xs">
            <h3 className="font-serif text-2xl font-bold text-[#3B1366] mb-1">
              Send An Inquiry
            </h3>
            <p className="text-xs text-[#3B1366]/80 mb-6 leading-relaxed">
              Have a query regarding bridal Paithani orders, custom Nauvari draping, bulk wedding gifting, or loom availability? Fill in the details below and our curator will respond within 4 business hours.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-[#FAF7F2] rounded-xs border border-[#D4AF37]/40 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#097969]/10 text-[#097969] flex items-center justify-center mx-auto mb-4 border border-[#097969]/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#3B1366]">
                  Inquiry Received!
                </h4>
                <p className="text-xs sm:text-sm text-[#3B1366]/80 mt-2 max-w-sm mx-auto">
                  Thank you for reaching out. Anandi’s client concierge will connect with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sayali Kulkarni"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                      Phone Number *
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sayali@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                    >
                      <option>Bridal Saree Consultation</option>
                      <option>Custom 9-Yard Nauvari Inquiries</option>
                      <option>Bulk Wedding & Corporate Gifting</option>
                      <option>Order Tracking & Custom Tailoring</option>
                      <option>Other Queries</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                    Your Message / Saree Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the occasion, preferred colors, or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#53208C] via-[#6B2BAF] to-[#53208C] hover:from-[#3B1366] hover:to-[#53208C] text-[#FAF7F2] text-xs font-semibold py-3 px-8 rounded-xs uppercase tracking-wider transition-colors shadow-xs border border-[#D4AF37]/40"
                >
                  Send Inquiry To Anandi
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
