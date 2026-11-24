import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  link: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    image: '/banners/hero-banner-1.jpg',
    alt: 'Anandi Sarees - Grace in Every Drape, Timeless Indian Heritage',
    link: '/collections/all',
  },
  {
    id: 'hero-2',
    image: '/banners/hero-banner-2.jpg',
    alt: 'The Nauvari Collection - Nine Yards of Tradition, Ready-to-wear & Traditional Kashta Drapes',
    link: '/collections/nauvari',
  },
  {
    id: 'hero-3',
    image: '/banners/hero-banner-3.jpg',
    alt: 'Maharashtrian Wedding Collection - Curated Bridal Paithani and Silk Sarees',
    link: '/collections/wedding',
  },
  {
    id: 'hero-4',
    image: '/banners/hero-banner-4.jpg',
    alt: 'Timeless Paithani Woven With Heritage - Handloom Silk Sarees with Rich Zari Borders',
    link: '/collections/paithani',
  },
];

export const HeroCampaign: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-slide every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section 
      className="relative w-full bg-[#1A0B2E] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero Banner Carousel"
    >
      {/* Horizontal Sliding Track (Chipade Saraaf Widescreen proportions ~1920x620 / 3.1:1 desktop, responsive mobile) */}
      <div className="relative w-full aspect-[2.6/1] sm:aspect-[2.8/1] lg:aspect-[3.1/1] min-h-[170px] sm:min-h-[260px] md:min-h-[380px] lg:min-h-[460px] overflow-hidden">
        <div 
          className="flex h-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, index) => (
            <div 
              key={slide.id}
              className="w-full h-full shrink-0 relative flex items-center justify-center bg-[#2B0E4E]"
            >
              <Link 
                to={slide.link}
                className="w-full h-full block relative group"
                tabIndex={index === currentSlide ? 0 : -1}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-1000 group-hover:scale-101"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Circular Floating Navigation Arrows (Inspired by Chipade Saraaf bottom-right / split controls) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#3B1366] shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-[#D4AF37]/50 z-20 backdrop-blur-xs"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#3B1366] shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-[#D4AF37]/50 z-20 backdrop-blur-xs"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Pill Indicators (Matching Chipade Saraaf Style: active pill in Gold, inactive in translucent white/gold) */}
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full h-1.5 sm:h-2 ${
                currentSlide === idx 
                  ? 'w-6 sm:w-8 bg-[#D4AF37] shadow-md shadow-[#D4AF37]/50' 
                  : 'w-2 bg-white/60 hover:bg-white/90'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
