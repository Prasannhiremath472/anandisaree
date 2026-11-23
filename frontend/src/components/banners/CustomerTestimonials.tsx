import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from 'lucide-react';
import { testimonials } from '../../data/testimonials';
import { SectionDivider } from '../decorative/SectionDivider';

export const CustomerTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex(prevIdx => (prevIdx - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setCurrentIndex(prevIdx => (prevIdx + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-16 sm:py-20 bg-[#F5EEFA] select-none border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionDivider
          title="Words of Appreciation"
          subtitle="Experiences Shared By Our Cherished Anandi Patrons"
          ornament="lotus"
        />

        {/* Testimonial Presentation Card in Royal Purple & Gold */}
        <div className="max-w-4xl mx-auto mt-10 relative">
          
          <div className="relative bg-[#FFFFFF] border-2 border-[#D4AF37] rounded-xs p-8 sm:p-12 shadow-xl">
            {/* Background Quote Watermark in Gold */}
            <Quote className="w-20 h-20 text-[#D4AF37]/20 absolute top-4 left-6 pointer-events-none -scale-x-100" />

            <div className="relative z-10 flex flex-col items-center text-center">
              
              {/* Star Rating in Gold */}
              <div className="flex items-center gap-1 text-[#D4AF37] mb-4">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#2A0B4C] italic leading-relaxed max-w-2xl">
                “{current.review}”
              </p>

              {/* Reviewer Details */}
              <div className="mt-6 pt-4 border-t border-[#F5EEFA] w-full max-w-md">
                <h4 className="font-serif text-base font-bold text-[#53208C] tracking-wide">
                  {current.name}
                </h4>
                <p className="text-xs text-[#5E4675] mt-0.5">
                  {current.city} • <span className="text-[#D4AF37] font-semibold">{current.occasion}</span>
                </p>
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#53208C] font-semibold mt-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Verified Purchase: {current.sareePurchased}</span>
                </div>
              </div>
            </div>

            {/* Navigation Arrows on sides */}
            <div className="absolute top-1/2 -translate-y-1/2 inset-x-2 sm:-inset-x-6 flex justify-between pointer-events-none">
              <button
                type="button"
                onClick={prev}
                className="w-10 h-10 rounded-full bg-[#FFFFFF] border-2 border-[#53208C] text-[#53208C] hover:bg-[#53208C] hover:text-[#FAF7F2] flex items-center justify-center shadow-lg transition-colors pointer-events-auto"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="w-10 h-10 rounded-full bg-[#FFFFFF] border-2 border-[#53208C] text-[#53208C] hover:bg-[#53208C] hover:text-[#FAF7F2] flex items-center justify-center shadow-lg transition-colors pointer-events-auto"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-6 bg-[#53208C]' : 'w-2 bg-[#D4AF37]/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
