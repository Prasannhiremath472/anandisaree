import React from 'react';
import { Video, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { EthnicBorderStrip } from '../decorative/EthnicBorderStrip';

export const VideoCallBanner: React.FC = () => {
  const { setIsVideoCallModalOpen } = useShop();

  return (
    <section className="relative w-full overflow-hidden bg-royal-purple text-[#FAF7F2] select-none">
      
      {/* Curved Upper Scalloped Boundary */}
      <div className="relative w-full pointer-events-none z-10 overflow-hidden leading-none">
        <svg 
          viewBox="0 0 1440 60" 
          className="w-full h-6 sm:h-10 md:h-14 fill-[#FAF7F2]"
          preserveAspectRatio="none"
        >
          <path 
            d="M 0,0 L 0,40 C 480,10 960,10 1440,40 L 1440,0 Z" 
            fill="#FAF7F2" 
          />
          <path 
            d="M 0,40 C 480,10 960,10 1440,40" 
            stroke="#D4AF37" 
            strokeWidth="1.8" 
            fill="none" 
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading & Description in Royal Purple & Gold */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3B1366] border border-[#D4AF37] rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
              <Video className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Bespoke Virtual Shopping</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#FFFFFF] leading-tight drop-shadow-sm">
              Shop With Us, <br />
              <span className="italic font-normal text-gold-gradient">Wherever You Are</span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#F4EFE6]/90 mt-4 max-w-md mx-auto lg:mx-0 leading-relaxed font-light">
              Experience personalized saree shopping with guidance from our collection specialists. Inspect intricate zari motifs, true fabric colors, and drape textures under natural lighting.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={() => setIsVideoCallModalOpen(true)}
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#2A0B4C] text-xs font-bold px-8 py-3.5 rounded-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-102"
              >
                <span>Connect With Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-[#FAF7F2]/80 font-medium">
                • Available in Marathi, Hindi & English
              </span>
            </div>
          </div>

          {/* Right Column: Boutique Consultation Photograph */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg aspect-[16/10] sm:aspect-[16/11] rounded-xs overflow-hidden shadow-2xl border-2 border-[#D4AF37] bg-[#3B1366]">
              <img
                src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1000&q=80"
                alt="Shop via Video Call at Anandi Sarees Boutique"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B4C]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 right-3 bg-[#53208C]/90 text-[#FAF7F2] text-xs px-3 py-1.5 rounded-xs backdrop-blur-xs flex items-center gap-2 border border-[#D4AF37] shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-xs tracking-wider">Live Boutique Desk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Repeating ethnic border strip */}
      <EthnicBorderStrip variant="geometric" color="#53208C" className="border-t border-[#D4AF37]" />
    </section>
  );
};
