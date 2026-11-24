import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, Video } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface MobileBottomNavProps {
  onOpenCategories: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenCategories }) => {
  const location = useLocation();
  const { totalCartCount, wishlist, setIsCartOpen, setIsVideoCallModalOpen } = useShop();

  const isHome = location.pathname === '/';
  const isWishlist = location.pathname === '/wishlist';
  const isCollections = location.pathname.startsWith('/collections');

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t-2 border-[#D4AF37] shadow-[0_-4px_20px_rgba(42,11,76,0.15)] pb-safe select-none">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isHome ? 'text-[#53208C] font-bold' : 'text-[#5E4675] hover:text-[#53208C]'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-wider uppercase">Home</span>
        </Link>

        {/* 2. Categories / Collections Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenCategories}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isCollections ? 'text-[#53208C] font-bold' : 'text-[#5E4675] hover:text-[#53208C]'
          }`}
          aria-label="Browse categories"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-wider uppercase">Weaves</span>
        </button>

        {/* 3. Live Video Consultation Quick CTA (Center Highlight) */}
        <button
          type="button"
          onClick={() => setIsVideoCallModalOpen(true)}
          className="flex flex-col items-center justify-center -mt-4 group focus:outline-none"
          aria-label="Book video shopping call"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#3B1366] via-[#53208C] to-[#6E32B6] border-2 border-[#D4AF37] flex items-center justify-center shadow-lg group-active:scale-95 transition-transform">
            <Video className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <span className="text-[9px] font-bold text-[#53208C] mt-1 tracking-tight uppercase">Live Video</span>
        </button>

        {/* 4. Wishlist */}
        <Link
          to="/wishlist"
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
            isWishlist ? 'text-[#53208C] font-bold' : 'text-[#5E4675] hover:text-[#53208C]'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isWishlist ? 'fill-current text-[#53208C]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#D4AF37] text-[#2A0B4C] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
            {isWishlist && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-wider uppercase">Wishlist</span>
        </Link>

        {/* 5. Cart Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-[#5E4675] hover:text-[#53208C] transition-colors relative"
          aria-label="View shopping bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#53208C] text-[#D4AF37] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#D4AF37] shadow-xs">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-wider uppercase">Bag</span>
        </button>

      </div>
    </div>
  );
};
