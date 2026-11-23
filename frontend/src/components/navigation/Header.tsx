import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, Sparkles } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { AnandiLogo } from './AnandiLogo';
import { CustomTraditionalMegaMenu } from './CustomTraditionalMegaMenu';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { useShop } from '../../context/ShopContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { totalCartCount, wishlist, setIsCartOpen } = useShop();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/collections/all?q=${encodeURIComponent(localSearch.trim())}`);
      setIsSearchActive(false);
    }
  };

  return (
    <>
      <header className="w-full relative z-40 bg-[#FAF7F2] border-b border-[#D4AF37]/40 transition-all select-none">
        {/* Top Announcement Bar in Deep Purple & Gold */}
        <AnnouncementBar />

        {/* Main Desktop Header */}
        <div className={`transition-all duration-300 ${isScrolled ? 'py-2 bg-[#FAF7F2]/95 backdrop-blur-md shadow-md' : 'py-3.5'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              
              {/* LEFT: Search Box & Mobile Trigger */}
              <div className="flex items-center gap-3 w-1/4">
                {/* Mobile Hamburger */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-1.5 text-[#53208C] hover:text-[#D4AF37] focus:outline-none"
                  aria-label="Open mobile navigation"
                >
                  <Menu className="w-6 h-6" />
                </button>

                {/* Mobile Search Toggle */}
                <button
                  type="button"
                  onClick={() => setIsSearchActive(!isSearchActive)}
                  className="lg:hidden p-1.5 text-[#53208C] hover:text-[#D4AF37] focus:outline-none"
                  aria-label="Toggle search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Desktop Search Input with Royal Purple & Gold Focus */}
                <form 
                  onSubmit={handleSearchSubmit} 
                  className="hidden lg:flex items-center relative w-full max-w-xs"
                >
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search Paithani, Nauvari, Silk..."
                    className="w-full bg-[#FFFFFF] border border-[#E8DDF0] rounded-xs pl-8 pr-3 py-1.5 text-xs text-[#2A0B4C] placeholder:text-[#5E4675]/60 focus:outline-none focus:border-[#53208C] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-2xs"
                  />
                  <Search className="w-3.5 h-3.5 text-[#53208C]/70 absolute left-2.5 pointer-events-none" />
                </form>
              </div>

              {/* CENTER: Original Anandi Sarees Logo Emblem & Wordmark */}
              <div className="flex-1 text-center flex justify-center py-1">
                <AnandiLogo size={isScrolled ? 'sm' : 'md'} />
              </div>

              {/* RIGHT: Wishlist, Account, Shopping Bag */}
              <div className="flex items-center justify-end gap-3 sm:gap-5 w-1/4">
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="relative p-1.5 text-[#53208C] hover:text-[#D4AF37] transition-colors focus:outline-none"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#2A0B4C] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Account */}
                <button
                  type="button"
                  onClick={() => alert('Anandi Sarees Privilege Portal — Sign in to view your orders and personalized consultations.')}
                  className="hidden sm:block p-1.5 text-[#53208C] hover:text-[#D4AF37] transition-colors focus:outline-none"
                  aria-label="Account"
                >
                  <User className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </button>

                {/* Cart Bag with Royal Purple & Gold Counter */}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-1.5 text-[#53208C] hover:text-[#D4AF37] transition-colors focus:outline-none flex items-center"
                  aria-label="Shopping Cart"
                >
                  <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#53208C] text-[#D4AF37] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-[#D4AF37] shadow-xs">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Expanded Search Bar */}
            {isSearchActive && (
              <div className="lg:hidden mt-3 pt-3 border-t border-[#E8DDF0] animate-fadeIn">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search by fabric, color or saree style..."
                    className="w-full bg-[#FFFFFF] border border-[#D4AF37] rounded-xs pl-9 pr-3 py-2 text-xs text-[#2A0B4C] focus:outline-none"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-[#53208C]/70 absolute left-3 top-2.5" />
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Bar (Desktop) — Custom Traditional Mega Menu Triggers */}
        <nav 
          className="hidden lg:block border-t border-[#D4AF37]/30 bg-[#FAF7F2] relative"
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center justify-center gap-6 xl:gap-8 text-xs uppercase tracking-[0.16em] font-medium text-[#2A0B4C] py-2.5">
              
              {/* SAREES (Mega Menu) */}
              <li 
                className="py-1"
                onMouseEnter={() => setActiveMegaMenu('sarees')}
              >
                <Link 
                  to="/collections/all" 
                  className={`transition-colors flex items-center gap-1 border-b-2 ${
                    activeMegaMenu === 'sarees' ? 'text-[#53208C] border-[#D4AF37] font-semibold' : 'border-transparent hover:text-[#53208C] hover:border-[#D4AF37]'
                  }`}
                >
                  <span>Sarees</span>
                </Link>
              </li>

              {/* COLLECTIONS (Mega Menu) */}
              <li 
                className="py-1"
                onMouseEnter={() => setActiveMegaMenu('collections')}
              >
                <Link 
                  to="/collections/all" 
                  className={`transition-colors border-b-2 ${
                    activeMegaMenu === 'collections' ? 'text-[#53208C] border-[#D4AF37] font-semibold' : 'border-transparent hover:text-[#53208C] hover:border-[#D4AF37]'
                  }`}
                >
                  Collections
                </Link>
              </li>

              {/* PAITHANI */}
              <li 
                className="py-1"
                onMouseEnter={() => setActiveMegaMenu('sarees')}
              >
                <Link to="/collections/paithani" className="hover:text-[#53208C] transition-colors border-b-2 border-transparent hover:border-[#D4AF37]">
                  Paithani
                </Link>
              </li>

              {/* NAUVARI */}
              <li className="py-1">
                <Link to="/collections/nauvari" className="hover:text-[#53208C] transition-colors border-b-2 border-transparent hover:border-[#D4AF37]">
                  Nauvari
                </Link>
              </li>

              {/* BEST SELLERS */}
              <li className="py-1">
                <Link to="/collections/best-sellers" className="hover:text-[#53208C] transition-colors border-b-2 border-transparent hover:border-[#D4AF37]">
                  Best Sellers
                </Link>
              </li>

              {/* NEW ARRIVALS */}
              <li className="py-1">
                <Link to="/collections/new-arrivals" className="hover:text-[#53208C] transition-colors border-b-2 border-transparent hover:border-[#D4AF37]">
                  New Arrivals
                </Link>
              </li>

              {/* WEDDING (Mega Menu) */}
              <li 
                className="py-1"
                onMouseEnter={() => setActiveMegaMenu('wedding')}
              >
                <Link 
                  to="/collections/wedding" 
                  className={`transition-colors border-b-2 ${
                    activeMegaMenu === 'wedding' ? 'text-[#53208C] border-[#D4AF37] font-semibold' : 'border-transparent hover:text-[#53208C] hover:border-[#D4AF37]'
                  }`}
                >
                  Wedding
                </Link>
              </li>

              {/* FESTIVE */}
              <li className="py-1">
                <Link to="/collections/festive" className="hover:text-[#53208C] transition-colors border-b-2 border-transparent hover:border-[#D4AF37]">
                  Festive
                </Link>
              </li>

              {/* HANDLOOM */}
              <li className="py-1">
                <Link to="/collections/handloom" className="hover:text-[#53208C] transition-colors border-b-2 border-transparent hover:border-[#D4AF37]">
                  Handloom
                </Link>
              </li>

              {/* UNDER ₹999 */}
              <li className="py-1">
                <Link 
                  to="/collections/under-999" 
                  className="text-[#53208C] font-bold hover:text-[#D4AF37] transition-colors border-b-2 border-transparent hover:border-[#D4AF37] flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Under ₹999</span>
                </Link>
              </li>

              {/* ABOUT US */}
              <li className="py-1">
                <Link to="/about" className="hover:text-[#53208C] transition-colors border-b-2 border-transparent hover:border-[#D4AF37]">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Large Custom Traditional Indian Mega Menu Panel */}
          <CustomTraditionalMegaMenu 
            activeCategory={activeMegaMenu}
            isOpen={activeMegaMenu !== null}
            onClose={() => setActiveMegaMenu(null)}
          />
        </nav>
      </header>

      {/* Mobile Menu Drawer with Royal Purple & Gold Palette */}
      <MobileMenuDrawer 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};
