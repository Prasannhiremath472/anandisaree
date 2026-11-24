import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight, ArrowRight } from 'lucide-react';

interface CustomMegaMenuProps {
  activeCategory: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomTraditionalMegaMenu: React.FC<CustomMegaMenuProps> = ({
  activeCategory,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !activeCategory) return null;

  // Content configuration for different categories
  const menuData = {
    sarees: {
      title: 'Royal Saree Drapes',
      badge: 'Heritage Collections',
      subcategories: [
        { name: 'Yeola Pure Paithani', slug: 'paithani', count: '48 Designs', tag: 'Royal Heirloom' },
        { name: 'Traditional 9-Yard Nauvari', slug: 'nauvari', count: '32 Designs', tag: 'Kashta Drape' },
        { name: 'Narayan Peth Temple Border', slug: 'narayan-peth', count: '26 Designs', tag: 'Pure Zari' },
        { name: 'Solapuri Combed Cotton', slug: 'solapuri-cotton', count: '38 Designs', tag: 'Handspun' },
        { name: 'Certified Handloom Weaves', slug: 'handloom', count: '54 Designs', tag: 'Silk Mark' },
        { name: 'Designer Mashru & Satin Silk', slug: 'designer', count: '42 Designs', tag: 'Contemporary' },
        { name: 'Festive Weaves Under ₹999', slug: 'under-999', count: '64 Designs', tag: 'Special Value' },
      ],
      featuredVisuals: [
        {
          title: 'Yeola Paithani',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
          link: '/collections/paithani',
        },
        {
          title: 'Nauvari Shalu',
          image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
          link: '/collections/nauvari',
        },
      ],
      campaign: {
        headline: 'The Grand Paithani Odyssey',
        description: 'Pure Mulberry silk and electroplated gold zari woven over 45 days in Yeola.',
        cta: 'Explore Royal Paithani',
        link: '/collections/paithani',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      }
    },
    wedding: {
      title: 'Maharashtrian Bridal & Wedding Edit',
      badge: 'Lagna Shalu Collection',
      subcategories: [
        { name: 'The Royal Bride (Lagna Shalu)', slug: 'wedding', count: '35 Designs', tag: 'Bridal Heirloom' },
        { name: 'Bridesmaids & Karavali Edit', slug: 'designer', count: '28 Designs', tag: 'Pastel & Jewel' },
        { name: 'Family Celebrations & Sakhar Puda', slug: 'festive', count: '40 Designs', tag: 'Auspicious' },
        { name: 'Wedding Guest Drapes', slug: 'all', count: '50+ Designs', tag: 'Silk & Zari' },
        { name: 'Heavy Zari Banarasi & Katan', slug: 'wedding', count: '22 Designs', tag: 'Pure Brocade' },
      ],
      featuredVisuals: [
        {
          title: 'The Bride',
          image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
          link: '/collections/wedding',
        },
        {
          title: 'The Bridesmaid',
          image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
          link: '/collections/wedding',
        },
      ],
      campaign: {
        headline: 'The Sacred Maratha Wedding',
        description: 'Complete bridal shalu and royal 9-yard Nauvari drapes crafted for your auspicious day.',
        cta: 'View Bridal Edit',
        link: '/collections/wedding',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      }
    },
    collections: {
      title: 'Curated Artisan Collections',
      badge: 'Bespoke Categories',
      subcategories: [
        { name: 'Timeless Best Sellers', slug: 'best-sellers', count: '24 Designs', tag: 'Customer Loved' },
        { name: 'New Loom Arrivals', slug: 'new-arrivals', count: '18 Designs', tag: 'Fresh Weaves' },
        { name: 'Shop By Craft (Ajrakh, Kalamkari)', slug: 'handloom', count: '32 Designs', tag: 'Handmade' },
        { name: 'Gudi Padwa Festive Edit', slug: 'festive', count: '29 Designs', tag: 'Celebratory' },
        { name: 'Boutique Exclusive Silks', slug: 'all', count: '45 Designs', tag: 'Limited Run' },
      ],
      featuredVisuals: [
        {
          title: 'Temple Borders',
          image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
          link: '/collections/narayan-peth',
        },
        {
          title: 'Handloom Silks',
          image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
          link: '/collections/handloom',
        },
      ],
      campaign: {
        headline: 'Handpicked By Master Drapers',
        description: 'Exclusively curated drapes celebrating Maharashtra’s timeless weaving traditions.',
        cta: 'Discover Collections',
        link: '/collections/all',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      }
    }
  }[activeCategory] || {
    title: 'Anandi Sarees Signature Weaves',
    badge: 'Artisan Masterpieces',
    subcategories: [
      { name: 'Yeola Pure Paithani', slug: 'paithani', count: '48 Designs', tag: 'Royal Heirloom' },
      { name: 'Traditional 9-Yard Nauvari', slug: 'nauvari', count: '32 Designs', tag: 'Kashta' },
      { name: 'Narayan Peth Temple Border', slug: 'narayan-peth', count: '26 Designs', tag: 'Pure Zari' },
      { name: 'Handspun Solapuri Cotton', slug: 'solapuri-cotton', count: '38 Designs', tag: 'Handloom' },
      { name: 'Festive Sarees Under ₹999', slug: 'under-999', count: '64 Designs', tag: 'Sale' },
    ],
    featuredVisuals: [
      {
        title: 'Yeola Paithani',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        link: '/collections/paithani',
      },
      {
        title: 'Nauvari Weave',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
        link: '/collections/nauvari',
      },
    ],
    campaign: {
      headline: 'Authentic Silk Mark Weaves',
      description: 'Loom-to-wardrobe purity guaranteed directly from Maharashtra weaver cooperatives.',
      cta: 'Explore All Sarees',
      link: '/collections/all',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    }
  };

  return (
    <div 
      className="absolute top-full left-0 w-full z-50 select-none animate-fadeIn"
      onMouseLeave={onClose}
    >
      {/* Upper Subtle Shadow & Gold Trim */}
      <div className="w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#F9E7B9] to-[#D4AF37]" />

      {/* Main Traditional Arch-Shaped Heritage Mega Menu Container */}
      <div className="relative bg-[#53208C] text-[#FAF7F2] shadow-2xl border-b-3 border-[#D4AF37]">
        {/* Subtle Background Watermark Motif */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.3) 0%, transparent 60%)`
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 relative z-10">
          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* Column 1: Categories & Weave Links (4 Cols) */}
            <div className="col-span-4 border-r border-[#D4AF37]/30 pr-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                  {menuData.badge}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-medium text-[#FFFFFF] mb-4">
                {menuData.title}
              </h3>

              <ul className="space-y-3">
                {menuData.subcategories.map((sub, i) => (
                  <li key={i}>
                    <Link
                      to={`/collections/${sub.slug}`}
                      onClick={onClose}
                      className="group flex items-center justify-between text-xs sm:text-sm text-[#F4EFE6] hover:text-[#D4AF37] transition-all py-1 border-b border-[#FAF7F2]/10"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium group-hover:translate-x-1 transition-transform">{sub.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#FAF7F2]/60 group-hover:text-[#F3E5AB]">
                          {sub.tag}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-3">
                <Link
                  to="/collections/all"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] hover:underline"
                >
                  <span>Explore Complete Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Column 2: Visual 3D-Style Cutout Medallions (4 Cols) */}
            <div className="col-span-4 border-r border-[#D4AF37]/30 pr-8">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-4">
                Signature Silhouettes
              </span>

              <div className="grid grid-cols-2 gap-4">
                {menuData.featuredVisuals.map((vis, idx) => (
                  <Link
                    key={idx}
                    to={vis.link}
                    onClick={onClose}
                    className="group flex flex-col items-center text-center"
                  >
                    {/* Arch Capsule Shape with Gold Border (as in Reference Screenshot Page 2) */}
                    <div 
                      className="relative w-full aspect-[3/4] overflow-hidden bg-[#3B1366] shadow-lg border-2 border-[#D4AF37] transition-transform duration-500 group-hover:scale-105"
                      style={{
                        borderTopLeftRadius: '9999px',
                        borderTopRightRadius: '9999px',
                        borderBottomLeftRadius: '6px',
                        borderBottomRightRadius: '6px',
                      }}
                    >
                      <img
                        src={vis.image}
                        alt={vis.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B4C]/85 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute inset-x-2 bottom-2 text-center">
                        <span className="font-serif text-xs sm:text-sm font-semibold text-[#FFFFFF] drop-shadow-sm">
                          {vis.title}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 p-3 bg-[#3B1366]/80 rounded-xs border border-[#D4AF37]/40 flex items-center justify-between text-xs">
                <span className="text-[#FAF7F2]/80">Need custom draping help?</span>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="text-[#D4AF37] font-bold hover:underline"
                >
                  Book Video Call &rarr;
                </Link>
              </div>
            </div>

            {/* Column 3: Featured Royal Campaign (4 Cols) */}
            <div className="col-span-4 flex flex-col justify-between h-full">
              <div 
                className="relative overflow-hidden rounded-xs border-2 border-[#D4AF37] p-6 bg-gradient-to-br from-[#3B1366] to-[#2A0B4C] shadow-xl flex flex-col justify-between h-full"
                style={{
                  minHeight: '260px'
                }}
              >
                {/* Background Saree Image with Vignette */}
                <div 
                  className="absolute inset-0 opacity-30 bg-cover bg-top pointer-events-none"
                  style={{ backgroundImage: `url(${menuData.campaign.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B4C] via-[#3B1366]/80 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-bold block mb-1">
                    Featured Royal Edit
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-medium text-[#FFFFFF] leading-snug">
                    {menuData.campaign.headline}
                  </h4>
                  <p className="text-xs text-[#FAF7F2]/80 mt-2 line-clamp-3 font-light leading-relaxed">
                    {menuData.campaign.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6">
                  <Link
                    to={menuData.campaign.link}
                    onClick={onClose}
                    className="inline-block bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#2A0B4C] text-xs font-bold px-5 py-2.5 rounded-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    {menuData.campaign.cta} &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scalloped / Curved Lower Boundary in Royal Purple with Gold Accent (Vastranand inspiration) */}
        <div className="relative w-full -mt-px pointer-events-none overflow-hidden leading-none z-20">
          <svg 
            viewBox="0 0 1440 32" 
            className="w-full h-4 sm:h-6 fill-[#FAF7F2]" 
            preserveAspectRatio="none"
          >
            <path 
              d="M 0,0 C 480,24 960,24 1440,0 L 1440,32 L 0,32 Z" 
              fill="#FAF7F2" 
            />
            <path 
              d="M 0,0 C 480,24 960,24 1440,0" 
              stroke="#D4AF37" 
              strokeWidth="2" 
              fill="none" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
