import React from 'react';
import { Banknote, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { EthnicBorderStrip } from '../decorative/EthnicBorderStrip';

export const ServiceTrustBanner: React.FC = () => {
  const highlights = [
    {
      icon: <Banknote className="w-7 h-7 text-[#D4AF37] stroke-[1.5]" />,
      title: 'Cash On Delivery',
      subtitle: 'Available On Domestic Orders',
    },
    {
      icon: <Truck className="w-7 h-7 text-[#D4AF37] stroke-[1.5]" />,
      title: '2-7 Days Express',
      subtitle: 'Insured Delivery Across India',
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-[#D4AF37] stroke-[1.5]" />,
      title: '100% Silk Mark Certified',
      subtitle: 'Authentic Pure Handloom Guarantee',
    },
    {
      icon: <RefreshCw className="w-7 h-7 text-[#D4AF37] stroke-[1.5]" />,
      title: '7 Days Easy Returns',
      subtitle: 'Doorstep Pickup & Exchanges',
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] select-none">
      {/* Top repeating ethnic ornamental border strip in Royal Purple & Gold */}
      <EthnicBorderStrip variant="geometric" color="#53208C" className="border-b border-[#D4AF37]/40" />

      {/* Main Curved Parchment Container in Royal Purple & Gold */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-2">
              <div className="w-14 h-14 rounded-full bg-[#53208C] border-2 border-[#D4AF37] flex items-center justify-center mb-3 shadow-md">
                {item.icon}
              </div>
              <h4 className="font-serif text-sm sm:text-base font-bold text-[#53208C] tracking-wide">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#5E4675] mt-1 max-w-[160px] leading-tight font-medium">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Central Metallic Gold Ornamental Flourish */}
        <div className="flex justify-center mt-8">
          <svg width="120" height="34" viewBox="0 0 120 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#D4AF37]">
            <path d="M60 28 C56 22 46 16 38 20 C30 24 34 32 44 30 C50 29 56 31 60 34 C64 31 70 29 76 30 C86 32 90 24 82 20 C74 16 64 22 60 28 Z" fill="#D4AF37" />
            <path d="M38 20 C24 16 12 24 6 18 C0 12 8 4 18 10 C24 14 30 16 38 20" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
            <path d="M82 20 C96 16 108 24 114 18 C120 12 112 4 102 10 C96 14 90 16 82 20" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
            <circle cx="60" cy="12" r="3" fill="#53208C" stroke="#D4AF37" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Curved Bottom Silhouette with Metallic Gold Outline */}
      <div className="relative w-full -mt-2 pointer-events-none z-20 overflow-hidden leading-none">
        <svg 
          viewBox="0 0 1440 60" 
          className="w-full h-6 sm:h-10 md:h-14 fill-[#F5EEFA]"
          preserveAspectRatio="none"
        >
          <path 
            d="M 0,0 C 480,45 960,45 1440,0 L 1440,60 L 0,60 Z" 
            fill="#F5EEFA" 
          />
          <path 
            d="M 0,0 C 480,45 960,45 1440,0" 
            stroke="#D4AF37" 
            strokeWidth="1.8" 
            fill="none" 
          />
        </svg>
      </div>

      {/* Bottom repeating ethnic border strip */}
      <EthnicBorderStrip variant="geometric" color="#53208C" className="bg-[#F5EEFA] border-t border-[#D4AF37]/30" />
    </section>
  );
};
