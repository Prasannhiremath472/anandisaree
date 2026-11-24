import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { EthnicBorderStrip } from '../decorative/EthnicBorderStrip';
import { AnandiLogo } from '../navigation/AnandiLogo';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-deep-purple text-[#FAF7F2] border-t-2 border-[#D4AF37] relative select-none">
      {/* Top repeating ethnic ornamental border strip */}
      <EthnicBorderStrip variant="geometric" color="#53208C" className="border-b border-[#D4AF37]/30" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Brand & Contact Strip with Original Anandi Logo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-[#D4AF37]/30 items-center">
          
          {/* Authentic Logo */}
          <div className="lg:col-span-4 text-center lg:text-left flex justify-center lg:justify-start">
            <AnandiLogo size="md" />
          </div>

          {/* Contact Details in Gold & Purple */}
          <div className="lg:col-span-5 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-semibold text-[#D4AF37]">Helpline:</span>
              <a href="tel:+919822054321" className="hover:underline text-[#FAF7F2]">
                +91 98220 54321
              </a>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <a 
                href="https://wa.me/919822054321" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1 bg-[#25D366]/20 text-[#25D366] px-2.5 py-1 rounded-xs font-semibold hover:bg-[#25D366]/30 transition-colors border border-[#25D366]/40"
              >
                WhatsApp Us
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <a href="mailto:care@anandisarees.com" className="hover:underline text-[#FAF7F2]">
                care@anandisarees.com
              </a>
            </div>
          </div>

          {/* Social Follow */}
          <div className="lg:col-span-3 flex items-center justify-center lg:justify-end gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">Follow Us:</span>
            <div className="flex items-center gap-2">
              {['Facebook', 'Instagram', 'Pinterest', 'YouTube'].map(platform => (
                <a
                  key={platform}
                  href={`#${platform.toLowerCase()}`}
                  className="w-7 h-7 rounded-full border border-[#D4AF37] flex items-center justify-center text-[10px] font-bold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2A0B4C] transition-all"
                  aria-label={platform}
                >
                  {platform.charAt(0)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Multi-Columns Layout in Royal Purple & Gold */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10 text-xs">
          
          {/* Col 1: Shop */}
          <div>
            <h5 className="font-serif text-base font-bold text-[#D4AF37] tracking-wider uppercase mb-3">
              Shop Royal Weaves
            </h5>
            <ul className="space-y-2 text-[#F4EFE6]/90">
              <li><Link to="/collections/paithani" className="hover:text-[#D4AF37] hover:underline">Pure Silk Yeola Paithani</Link></li>
              <li><Link to="/collections/nauvari" className="hover:text-[#D4AF37] hover:underline">Traditional 9-Yard Nauvari</Link></li>
              <li><Link to="/collections/narayan-peth" className="hover:text-[#D4AF37] hover:underline">Narayan Peth Temple Border</Link></li>
              <li><Link to="/collections/solapuri-cotton" className="hover:text-[#D4AF37] hover:underline">Handspun Solapuri Cotton</Link></li>
              <li><Link to="/collections/wedding" className="hover:text-[#D4AF37] hover:underline">Maharashtrian Bridal Shalu</Link></li>
              <li><Link to="/collections/under-999" className="text-[#F3E5AB] font-bold hover:underline">Under ₹999 Festive Edit</Link></li>
              <li><Link to="/collections/all" className="hover:text-[#D4AF37] hover:underline">View All Sarees</Link></li>
            </ul>
          </div>

          {/* Col 2: Client Support */}
          <div>
            <h5 className="font-serif text-base font-bold text-[#D4AF37] tracking-wider uppercase mb-3">
              Client Support
            </h5>
            <ul className="space-y-2 text-[#F4EFE6]/90">
              <li><Link to="/faq" className="hover:text-[#D4AF37] hover:underline">Frequently Asked Questions</Link></li>
              <li><Link to="/shipping-and-returns" className="hover:text-[#D4AF37] hover:underline">Shipping & Delivery Policies</Link></li>
              <li><Link to="/shipping-and-returns" className="hover:text-[#D4AF37] hover:underline">Easy 7-Day Returns & Exchanges</Link></li>
              <li><Link to="/contact" className="hover:text-[#D4AF37] hover:underline">Book Video Shopping Consultation</Link></li>
              <li><Link to="/contact" className="hover:text-[#D4AF37] hover:underline">Custom Blouse Stitching Inquiries</Link></li>
              <li><Link to="/about" className="hover:text-[#D4AF37] hover:underline">Silk & Zari Preservation Guide</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h5 className="font-serif text-base font-bold text-[#D4AF37] tracking-wider uppercase mb-3">
              House of Anandi
            </h5>
            <ul className="space-y-2 text-[#F4EFE6]/90">
              <li><Link to="/about" className="hover:text-[#D4AF37] hover:underline">Our Story & Legacy</Link></li>
              <li><Link to="/about" className="hover:text-[#D4AF37] hover:underline">Yeola & Paithan Weaver Guilds</Link></li>
              <li><Link to="/about" className="hover:text-[#D4AF37] hover:underline">Authenticity & Silk Mark Guarantee</Link></li>
              <li><Link to="/contact" className="hover:text-[#D4AF37] hover:underline">Flagship Boutiques</Link></li>
              <li><Link to="/contact" className="hover:text-[#D4AF37] hover:underline">Corporate & Bulk Gifting</Link></li>
            </ul>
          </div>

          {/* Col 4: Boutiques */}
          <div>
            <h5 className="font-serif text-base font-bold text-[#D4AF37] tracking-wider uppercase mb-3">
              Flagship Boutiques
            </h5>
            <div className="space-y-3 text-[#F4EFE6]/90">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[#FFFFFF]">Pune Flagship Boutique</span>
                  <p className="text-[11px] leading-relaxed text-[#F4EFE6]/80">742 Laxmi Road, Sadashiv Peth, Pune, Maharashtra 411030</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[#FFFFFF]">Mumbai Experience Studio</span>
                  <p className="text-[11px] leading-relaxed text-[#F4EFE6]/80">Ranade Road, Dadar West, Mumbai, Maharashtra 400028</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D4AF37]/30 flex items-center gap-1.5 text-[#D4AF37] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Certified Handloom Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-[#3B1366] rounded-xs border-2 border-[#D4AF37] p-6 mb-8 text-center shadow-lg">
          <h4 className="font-serif text-xl sm:text-2xl text-[#FFFFFF] font-medium">
            Stay Woven Into Our World
          </h4>
          <p className="text-xs text-[#F4EFE6]/80 max-w-md mx-auto mt-1 mb-4 font-light">
            Receive exclusive invitations to new Paithani loom releases, festive collections, and private trunk shows.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-[#2A0B4C] border border-[#D4AF37] rounded-xs px-3 py-2 text-xs text-[#FAF7F2] placeholder:text-[#F4EFE6]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
            <button
              type="submit"
              className="bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#2A0B4C] text-xs font-bold px-5 py-2 uppercase tracking-wider transition-colors shrink-0 shadow-md"
            >
              Subscribe
            </button>
          </form>

          {subscribed && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#F3E5AB] font-semibold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you for joining the Anandi Sarees family!</span>
            </div>
          )}
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F4EFE6]/70 gap-3">
          <p>
            &copy; {new Date().getFullYear()} ANANDI SAREES. All Rights Reserved. Tradition Woven With Elegance.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/shipping-and-returns" className="hover:text-[#D4AF37] hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link to="/shipping-and-returns" className="hover:text-[#D4AF37] hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link to="/shipping-and-returns" className="hover:text-[#D4AF37] hover:underline">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
