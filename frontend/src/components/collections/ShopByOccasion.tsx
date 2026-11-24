import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SectionDivider } from '../decorative/SectionDivider';

interface WeddingLook {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  image: string;
  slug: string;
}

const WEDDING_LOOKS: WeddingLook[] = [
  {
    id: 'bride',
    title: 'The Royal Bride',
    subtitle: 'Made For The Big Day',
    role: 'Lagna Mandap',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80',
    slug: 'wedding',
  },
  {
    id: 'bridesmaid',
    title: 'The Bridesmaid',
    subtitle: "For The Bride's Crew",
    role: 'Sangeet & Mehendi',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=700&q=80',
    slug: 'wedding',
  },
  {
    id: 'family',
    title: 'The Family Edit',
    subtitle: 'For Every Sacred Celebration',
    role: 'Haldi & Puja',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80',
    slug: 'festive',
  },
  {
    id: 'guest',
    title: 'Wedding Guest Look',
    subtitle: 'Looks For Every Function',
    role: 'Reception Gala',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
    slug: 'designer',
  },
  {
    id: 'mother-of-bride',
    title: 'Matriarch Grace',
    subtitle: 'Dignified Heritage Weaves',
    role: 'Auspicious Muhurat',
    image: 'https://images.unsplash.com/photo-1610030469668-935a4d6f0f5b?auto=format&fit=crop&w=700&q=80',
    slug: 'paithani',
  },
  {
    id: 'trousseau',
    title: 'Bridal Trousseau',
    subtitle: 'Heirloom Keepsakes For A Lifetime',
    role: 'Vidaai & Grihapravesh',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80',
    slug: 'nauvari',
  },
];

export const ShopByOccasion: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Smooth Auto-scroll ticker that pauses when user hovers or touches
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const step = clientWidth > 640 ? 320 : 250;
        scrollRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section 
      className="py-14 sm:py-20 bg-[#FAF7F2] select-none relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="relative">
          <SectionDivider 
            title="Wedding Styles For Everyone" 
            subtitle="Auspicious Drapes Curated For The Bride, Family & Festive Soirées"
            ornament="lotus"
          />

          {/* Controls Header Pill (Desktop & Mobile) */}
          <div className="hidden sm:flex items-center justify-end gap-2 -mt-6 mb-6">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous wedding style"
              className={`w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center transition-all ${
                canScrollLeft 
                  ? 'bg-white hover:bg-[#53208C] text-[#3B1366] hover:text-[#FAF7F2] shadow-md hover:scale-105 active:scale-95' 
                  : 'bg-white/40 text-[#3B1366]/30 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next wedding style"
              className={`w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center transition-all ${
                canScrollRight 
                  ? 'bg-white hover:bg-[#53208C] text-[#3B1366] hover:text-[#FAF7F2] shadow-md hover:scale-105 active:scale-95' 
                  : 'bg-white/40 text-[#3B1366]/30 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Moving Carousel Track */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {WEDDING_LOOKS.map((item) => (
              <div 
                key={item.id} 
                className="shrink-0 w-[240px] sm:w-[280px] md:w-[310px] snap-center group"
              >
                <Link
                  to={`/collections/${item.slug}`}
                  className="block relative flex flex-col transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Capsule Arch Top Card Frame with Metallic Gold Border (Reference Screenshot Page 2) */}
                  <div 
                    className="relative aspect-[3/5] w-full overflow-hidden bg-[#3B1366] shadow-xl border-2 border-[#D4AF37] group-hover:border-[#F3E5AB] transition-colors"
                    style={{
                      borderTopLeftRadius: '9999px',
                      borderTopRightRadius: '9999px',
                      borderBottomLeftRadius: '12px',
                      borderBottomRightRadius: '12px',
                    }}
                  >
                    {/* Inner Dashed Gold Rule */}
                    <div 
                      className="absolute inset-1.5 sm:inset-2 pointer-events-none z-10"
                      style={{
                        borderTopLeftRadius: '9999px',
                        borderTopRightRadius: '9999px',
                        borderBottomLeftRadius: '8px',
                        borderBottomRightRadius: '8px',
                        border: '1px dashed rgba(212, 175, 55, 0.4)'
                      }}
                    />

                    {/* Role Tag Pill at Top Arch */}
                    <div className="absolute top-4 inset-x-0 flex justify-center z-20 pointer-events-none">
                      <span className="bg-[#3B1366]/90 backdrop-blur-xs text-[#D4AF37] border border-[#D4AF37]/60 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                        {item.role}
                      </span>
                    </div>

                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                      loading="lazy"
                    />

                    {/* Deep Royal Purple Gradient Overlay at Bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-36 sm:h-48 bg-gradient-to-t from-[#2A0B4C] via-[#3B1366]/85 to-transparent pointer-events-none" />

                    {/* Content Overlay at Bottom */}
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 text-center text-[#FAF7F2] z-20">
                      <h3 className="font-serif text-base sm:text-2xl font-bold tracking-wide text-[#FFFFFF] drop-shadow-sm group-hover:text-gold-gradient transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-[#F4EFE6]/90 mt-1 font-light tracking-wide line-clamp-1">
                        {item.subtitle}
                      </p>
                      
                      <div className="mt-2.5 sm:mt-3.5 inline-block bg-[#53208C] group-hover:bg-[#D4AF37] text-[#FAF7F2] group-hover:text-[#2A0B4C] text-[10px] sm:text-[11px] font-bold px-4 sm:px-5 py-1.5 rounded-full uppercase tracking-widest border border-[#D4AF37] transition-all shadow-md group-hover:shadow-lg">
                        Explore Drape
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Mobile Swipe Guidance Indicator */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 mt-2">
            <span className="text-[11px] text-[#53208C] font-serif italic tracking-wide">
              Swipe horizontally to view all wedding looks →
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
