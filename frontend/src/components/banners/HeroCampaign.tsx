import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Crown } from 'lucide-react';
import { EthnicBorderStrip } from '../decorative/EthnicBorderStrip';
import { CornerFlourish } from '../decorative/CornerFlourish';

export const HeroCampaign: React.FC = () => {
  return (
    <section className="relative w-full bg-royal-purple overflow-hidden select-none border-b-2 border-[#D4AF37]">
      
      {/* Background Royal Palace Architectural & Mandala Motifs */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(circle at 75% 40%, rgba(212, 175, 55, 0.35) 0%, transparent 60%),
            radial-gradient(circle at 25% 60%, rgba(110, 50, 182, 0.4) 0%, transparent 70%)
          `
        }}
      />

      {/* Decorative Palace Columns & Golden Mandala SVG Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <svg viewBox="0 0 1440 800" className="w-full h-full text-[#D4AF37]" fill="none">
          {/* Palace Arches Outline */}
          <path d="M 0,800 L 0,300 Q 360,100 720,300 Q 1080,100 1440,300 L 1440,800 Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 100,800 L 100,340 Q 360,160 620,340 L 620,800" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
          <path d="M 820,800 L 820,340 Q 1080,160 1340,340 L 1340,800" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
          {/* Central Royal Sunburst / Mandala */}
          <circle cx="720" cy="200" r="140" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
          <circle cx="720" cy="200" r="100" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column: Royal Editorial Headlines & Story */}
          <div className="lg:col-span-6 text-center lg:text-left">
            
            {/* Royal Privilege Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#3B1366] border border-[#D4AF37] rounded-full text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37] mb-5 shadow-md">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Royal Maharashtrian Handloom</span>
            </div>

            {/* Campaign Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FFFFFF] font-medium leading-[1.12] tracking-tight drop-shadow-md">
              Elegance Woven <br className="hidden sm:inline" />
              <span className="italic font-normal text-gold-gradient">Through Generations</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-[#F4EFE6]/90 mt-5 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Discover the beauty of Indian tradition through sarees crafted to celebrate elegance, culture and timeless style.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/collections/all"
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#2A0B4C] text-xs sm:text-sm font-bold px-8 py-4 rounded-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-102"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/collections/paithani"
                className="w-full sm:w-auto bg-[#3B1366]/80 hover:bg-[#3B1366] text-[#FAF7F2] border-2 border-[#D4AF37] text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-xs uppercase tracking-[0.18em] text-center transition-all shadow-md hover:scale-102"
              >
                Shop Now
              </Link>
            </div>

            {/* Micro Trust Indicators with Gold Highlights */}
            <div className="mt-10 pt-6 border-t border-[#D4AF37]/30 grid grid-cols-3 gap-3 text-center lg:text-left text-xs">
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF37] block">2000+</span>
                <span className="text-[11px] text-[#FAF7F2]/80 uppercase tracking-wider">Years of Heritage</span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF37] block">100%</span>
                <span className="text-[11px] text-[#FAF7F2]/80 uppercase tracking-wider">Pure Silk Mark</span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF37] block">Yeola</span>
                <span className="text-[11px] text-[#FAF7F2]/80 uppercase tracking-wider">Master Pit-Looms</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered 3D Indian Arch Palace Framing & Cutout Model */}
          <div className="lg:col-span-6 relative flex justify-center">
            
            {/* Outer Palace Jharokha Arch Shape with Gold Gradient Border */}
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[3/4] flex items-center justify-center">
              
              {/* Corner Ornaments */}
              <CornerFlourish position="top-left" className="-top-3 -left-3" size={54} color="#D4AF37" />
              <CornerFlourish position="top-right" className="-top-3 -right-3" size={54} color="#D4AF37" />
              <CornerFlourish position="bottom-left" className="-bottom-3 -left-3" size={54} color="#D4AF37" />
              <CornerFlourish position="bottom-right" className="-bottom-3 -right-3" size={54} color="#D4AF37" />

              {/* Decorative Arch Backdrop Silhouette */}
              <div 
                className="relative w-full h-full overflow-hidden shadow-2xl bg-[#3B1366]"
                style={{
                  borderTopLeftRadius: '50% 30%',
                  borderTopRightRadius: '50% 30%',
                  borderBottomLeftRadius: '12px',
                  borderBottomRightRadius: '12px',
                  border: '3px solid #D4AF37',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 25px rgba(212,175,55,0.35)'
                }}
              >
                {/* Inner Dashed Gold Accent */}
                <div 
                  className="absolute inset-2 pointer-events-none z-10"
                  style={{
                    borderTopLeftRadius: '50% 30%',
                    borderTopRightRadius: '50% 30%',
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px',
                    border: '1px dashed #F3E5AB'
                  }}
                />

                {/* Saree Model Layered Photograph */}
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
                  alt="Anandi Sarees Royal Paithani"
                  className="w-full h-full object-cover object-top filter contrast-105 hover:scale-103 transition-transform duration-1000 ease-out"
                />

                {/* Deep Royal Purple Gradient Vignette at Bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#2A0B4C] via-[#3B1366]/60 to-transparent pointer-events-none" />

                {/* Lower Floating Tag in Metallic Gold */}
                <div className="absolute inset-x-4 bottom-4 z-20 text-center bg-[#2A0B4C]/90 backdrop-blur-xs border border-[#D4AF37] py-2 px-3 rounded-xs shadow-lg">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
                    Royal Yeola Paithani
                  </span>
                  <p className="font-serif text-sm sm:text-base text-[#FFFFFF] font-medium mt-0.5">
                    Traditional Mor-Bangadi Pure Gold Zari Weave
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Repeating Ethnic Border Strip at Bottom of Hero */}
      <EthnicBorderStrip variant="geometric" color="#53208C" className="border-t border-[#D4AF37]" />
    </section>
  );
};
