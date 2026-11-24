import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Search, ChevronRight, Phone, Video, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { categories } from '../../data/categories';
import { AnandiLogo } from './AnandiLogo';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlist, totalCartCount, setIsCartOpen, setIsVideoCallModalOpen } = useShop();
  const [mobileSearch, setMobileSearch] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-[#FAF7F2] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Header with Original Anandi Logo */}
        <div className="p-4 border-b border-[#D4AF37]/40 flex items-center justify-between bg-[#53208C] text-[#FAF7F2]">
          <AnandiLogo size="sm" />
          <button 
            onClick={onClose} 
            className="p-1.5 text-[#D4AF37] hover:text-[#FFFFFF] transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#E8DDF0] bg-[#FAF7F2]">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (mobileSearch.trim()) {
                window.location.href = `/collections/all?q=${encodeURIComponent(mobileSearch)}`;
                onClose();
              }
            }}
            className="relative"
          >
            <input 
              type="text" 
              placeholder="Search Paithani, Nauvari, Silk..."
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#D4AF37]/50 rounded-xs pl-9 pr-3 py-2 text-xs text-[#2A0B4C] focus:outline-none focus:border-[#53208C]"
            />
            <Search className="w-4 h-4 text-[#53208C]/70 absolute left-3 top-2.5" />
          </form>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 border-b border-[#E8DDF0] text-xs divide-x divide-[#E8DDF0] bg-[#FFFFFF]">
          <Link 
            to="/wishlist" 
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-3 hover:bg-[#F5EEFA] text-[#53208C] font-semibold"
          >
            <Heart className="w-4 h-4 text-[#D4AF37] fill-current" />
            <span>Wishlist ({wishlist.length})</span>
          </Link>
          <button 
            onClick={() => {
              onClose();
              setIsCartOpen(true);
            }}
            className="flex items-center justify-center gap-2 py-3 hover:bg-[#F5EEFA] text-[#53208C] font-semibold"
          >
            <ShoppingBag className="w-4 h-4 text-[#53208C]" />
            <span>Bag ({totalCartCount})</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-2 space-y-1">
          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#53208C] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Royal Collections</span>
          </div>

          <Link
            to="/collections/all"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 text-sm text-[#2A0B4C] font-semibold hover:bg-[#F5EEFA] rounded-xs"
          >
            <span>All Sarees</span>
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>

          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/collections/${cat.slug}`}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2 text-sm text-[#3B1366] hover:bg-[#F5EEFA] rounded-xs"
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-[#D4AF37] font-semibold">{cat.highlightText}</span>
            </Link>
          ))}

          <Link
            to="/collections/wedding"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 text-sm text-[#53208C] font-semibold hover:bg-[#F5EEFA] rounded-xs"
          >
            <span>Maharashtrian Bridal Shalu</span>
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>

          <Link
            to="/collections/under-999"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 text-sm text-[#53208C] font-bold hover:bg-[#F5EEFA] rounded-xs"
          >
            <span>Under ₹999 Festive Edit</span>
            <span className="bg-[#53208C] text-[#D4AF37] text-[9px] px-1.5 py-0.5 rounded-xs font-bold border border-[#D4AF37]">SALE</span>
          </Link>

          <Link
            to="/collections/best-sellers"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 text-sm text-[#3B1366] hover:bg-[#F5EEFA] rounded-xs"
          >
            <span>Best Sellers</span>
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>

          <Link
            to="/collections/new-arrivals"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 text-sm text-[#3B1366] hover:bg-[#F5EEFA] rounded-xs"
          >
            <span>New Loom Arrivals</span>
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>

          <div className="pt-4 mt-2 border-t border-[#E8DDF0] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#53208C]">
            House of Anandi
          </div>

          <Link
            to="/about"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 text-sm text-[#3B1366] hover:bg-[#F5EEFA] rounded-xs"
          >
            <span>Our Story & Weaving Legacy</span>
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>

          <Link
            to="/contact"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 text-sm text-[#3B1366] hover:bg-[#F5EEFA] rounded-xs"
          >
            <span>Boutiques & Consultations</span>
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>

          <Link
            to="/faq"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 text-sm text-[#3B1366] hover:bg-[#F5EEFA] rounded-xs"
          >
            <span>Frequently Asked Questions</span>
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>
        </div>

        {/* Video Call Consultation CTA in Royal Purple & Gold */}
        <div className="p-4 border-t border-[#D4AF37]/50 bg-[#3B1366] text-[#FAF7F2]">
          <button
            onClick={() => {
              onClose();
              setIsVideoCallModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#2A0B4C] font-bold py-2.5 px-4 text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            <Video className="w-4 h-4" />
            <span>Shop Via Video Call</span>
          </button>
          <div className="mt-2 text-center text-[11px] text-[#F4EFE6]/80 flex items-center justify-center gap-1.5">
            <Phone className="w-3 h-3 text-[#D4AF37]" />
            <span>Mon–Sat: 10:30 AM – 8:00 PM IST</span>
          </div>
        </div>
      </div>
    </div>
  );
};
