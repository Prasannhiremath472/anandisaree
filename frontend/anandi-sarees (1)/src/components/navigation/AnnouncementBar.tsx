import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const announcements = [
  'ANANDI SAREES — ROYAL MAHARASHTRIAN PAITHANI & NAUVARI WEAVES',
  'COMPLIMENTARY DOMESTIC DISPATCH & SILK MARK CERTIFICATION ON ALL ORDERS',
  'NEW BRIDAL LAGNA SHALU & FESTIVE ARRIVALS NOW LIVE — SHOP THE EDIT',
  'EXPERIENCE LUXURY AT HOME — BOOK A BESPOKE VIRTUAL VIDEO CONSULTATION'
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % announcements.length);
  };

  return (
    <div className="bg-[#3B1366] text-[#FAF7F2] border-b border-[#D4AF37]/50 text-[11px] sm:text-xs py-2 px-4 transition-colors select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={handlePrev} 
          aria-label="Previous announcement"
          className="p-1 text-[#D4AF37] hover:text-[#FFFFFF] transition-colors focus:outline-none"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="overflow-hidden flex-1 text-center font-medium tracking-[0.18em] px-2 uppercase flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0 hidden sm:inline" />
          <span className="inline-block transition-all duration-500 ease-in-out text-[#F4EFE6]">
            {announcements[currentIndex]}
          </span>
          <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0 hidden sm:inline" />
        </div>

        <button 
          onClick={handleNext} 
          aria-label="Next announcement"
          className="p-1 text-[#D4AF37] hover:text-[#FFFFFF] transition-colors focus:outline-none"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
