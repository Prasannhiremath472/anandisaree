import React from 'react';
import { Link } from 'react-router-dom';
import { OrnamentalModelFrame } from '../decorative/OrnamentalModelFrame';
import { EthnicBorderStrip } from '../decorative/EthnicBorderStrip';
import { CornerFlourish } from '../decorative/CornerFlourish';

export const CustomHeritageCampaign: React.FC = () => {
  const medallionModels = [
    {
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
      title: 'Yeola Paithani',
      link: '/collections/paithani',
    },
    {
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80',
      title: 'Nauvari Shalu',
      link: '/collections/nauvari',
    },
    {
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=700&q=80',
      title: 'Narayan Peth',
      link: '/collections/narayan-peth',
    },
  ];

  const craftLinks = [
    { label: 'View All', link: '/collections/all' },
    { label: 'Pure Yeola Paithani', link: '/collections/paithani' },
    { label: 'Traditional Nauvari (9 Yards)', link: '/collections/nauvari' },
    { label: 'Narayan Peth Temple Border', link: '/collections/narayan-peth' },
    { label: 'Solapuri Combed Cotton', link: '/collections/solapuri-cotton' },
    { label: 'Loom-Certified Handloom', link: '/collections/handloom' },
    { label: 'Chanderi Zari Tissue', link: '/collections/festive' },
    { label: 'Banarasi Katan Silk', link: '/collections/wedding' },
    { label: 'Natural Resist Ajrakh', link: '/collections/handloom' },
    { label: 'Authentic Pen Kalamkari', link: '/collections/handloom' },
    { label: 'Under ₹999 Festive Edit', link: '/collections/under-999' },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-parchment-royal select-none">
      {/* Top repeating ethnic border strip in Royal Purple & Gold */}
      <EthnicBorderStrip variant="floral" color="#53208C" className="border-b border-[#D4AF37]/50" />

      {/* Main Parchment Box with Botanical Silhouettes */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        {/* Vintage Corner Flourishes in Gold */}
        <CornerFlourish position="top-left" className="top-4 left-4" size={56} color="#D4AF37" />
        <CornerFlourish position="top-right" className="top-4 right-4" size={56} color="#D4AF37" />

        {/* 3 Circular Ornamental Medallion Models with Gold Mandala Rings (Reference Screenshot Page 4) */}
        <div className="flex items-center justify-center gap-2 sm:gap-10 md:gap-16 pt-2 pb-6">
          {medallionModels.map((item, idx) => (
            <OrnamentalModelFrame
              key={idx}
              image={item.image}
              title={item.title}
              link={item.link}
              variant="medallion"
            />
          ))}
        </div>

        {/* Central Editorial Statement in Royal Purple & Gold */}
        <div className="text-center max-w-3xl mx-auto mt-4 px-2">
          <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#D4AF37] font-bold block mb-1">
            Story of Maharashtra & India’s Hidden Gems
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-medium text-[#53208C] tracking-tight">
            Every Saree Tells a Story
          </h2>
          <p className="text-xs sm:text-sm text-[#5E4675] max-w-xl mx-auto mt-2 leading-relaxed font-light">
            Each warp and weft celebrates the sacred hands of master artisans. From the royal court drapes of the Maratha Empire to the vibrant festivities of today.
          </p>

          <div className="mt-4 sm:mt-5">
            <Link
              to="/collections/all"
              className="inline-block bg-[#53208C] hover:bg-[#3B1366] text-[#FAF7F2] text-xs font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xs uppercase tracking-[0.16em] transition-all shadow-md hover:shadow-xl border border-[#D4AF37] active:scale-95"
            >
              Explore Collections
            </Link>
          </div>
        </div>

        {/* Saree Craft Sub-Links - Clean Tap-Friendly Pills on Mobile */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#D4AF37]/30 max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[#53208C]">
            {craftLinks.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="px-2.5 py-1 rounded-full bg-white/70 hover:bg-[#53208C] hover:text-[#FAF7F2] border border-[#D4AF37]/50 transition-all font-medium active:scale-95 shadow-2xs"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Heritage Curved Lower Boundary SVG (Concave arch upward, as seen in Reference Screenshot Page 4) */}
      <div className="relative w-full -mt-2 pointer-events-none z-20 overflow-hidden leading-none">
        <svg 
          viewBox="0 0 1440 70" 
          className="w-full h-8 sm:h-12 md:h-16 lg:h-20"
          preserveAspectRatio="none"
        >
          {/* Below area fills with light ivory cream */}
          <path 
            d="M 0,0 C 420,60 1020,60 1440,0 L 1440,70 L 0,70 Z" 
            fill="#FAF7F2" 
          />
          {/* Outline metallic gold line */}
          <path 
            d="M 0,0 C 420,60 1020,60 1440,0" 
            stroke="#D4AF37" 
            strokeWidth="2" 
            fill="none" 
          />
        </svg>
      </div>

      {/* Repeating ornamental border strip below the curve */}
      <EthnicBorderStrip variant="geometric" color="#53208C" className="bg-[#FAF7F2]" />
    </section>
  );
};
