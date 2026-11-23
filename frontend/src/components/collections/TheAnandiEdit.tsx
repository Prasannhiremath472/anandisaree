import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OrnamentalModelFrame } from '../decorative/OrnamentalModelFrame';
import { EthnicBorderStrip } from '../decorative/EthnicBorderStrip';

export const TheAnandiEdit: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const edits = [
    {
      title: 'SAREES',
      subtitle: 'ROYAL DRAPES',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
      link: '/collections/all',
    },
    {
      title: 'PAITHANI',
      subtitle: 'YEOLA HEIRLOOM',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80',
      link: '/collections/paithani',
    },
    {
      title: 'NAUVARI',
      subtitle: '9-YARD TRADITION',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=700&q=80',
      link: '/collections/nauvari',
    },
    {
      title: 'BRIDAL WEAR',
      subtitle: 'LAGNA SHALU',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
      link: '/collections/wedding',
    },
    {
      title: 'FESTIVE EDIT',
      subtitle: 'GUDI PADWA & UTSAV',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80',
      link: '/collections/festive',
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#FAF7F2] relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#D4AF37]/30">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#53208C] font-medium tracking-wide">
              The Anandi Edit
            </h2>
            <p className="text-xs sm:text-sm text-[#5E4675] mt-1 uppercase tracking-wider">
              Signature Handcrafted Silhouettes & Royal Maharashtrian Drapes
            </p>
          </div>

          {/* Navigation Controls in Gold */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-[#53208C] text-[#53208C] hover:bg-[#53208C] hover:text-[#FAF7F2] flex items-center justify-center transition-colors focus:outline-none"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-[#53208C] text-[#53208C] hover:bg-[#53208C] hover:text-[#FAF7F2] flex items-center justify-center transition-colors focus:outline-none"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 Unique Framed Model Photographs (Reference Screenshot Page 3) */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-8 overflow-x-auto pb-6 pt-2 hide-scrollbar items-center justify-start lg:justify-center"
        >
          {edits.map((item, idx) => (
            <div key={idx} className="shrink-0">
              <OrnamentalModelFrame
                image={item.image}
                title={item.title}
                subtitle={item.subtitle}
                link={item.link}
                variant="jharokha"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Repeating ethnic border strip underneath */}
      <EthnicBorderStrip variant="geometric" color="#53208C" className="mt-8 border-t border-[#D4AF37]/40" />
    </section>
  );
};
