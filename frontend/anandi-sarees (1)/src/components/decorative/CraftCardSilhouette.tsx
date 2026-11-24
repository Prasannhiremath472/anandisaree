import React from 'react';
import { Link } from 'react-router-dom';
import type { CraftStory } from '../../types';

interface CraftCardSilhouetteProps {
  craft: CraftStory;
  className?: string;
}

export const CraftCardSilhouette: React.FC<CraftCardSilhouetteProps> = ({
  craft,
  className = '',
}) => {
  return (
    <Link 
      to={`/collections/${craft.slug}`}
      className={`group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 focus:outline-none ${className}`}
    >
      {/* Upper Arch / Jharokha Shaped Silhouette Card */}
      <div className="relative w-36 sm:w-44 md:w-48 h-48 sm:h-56 md:h-60 flex flex-col items-center">
        {/* Scalloped Arch Frame in Royal Purple & Gold */}
        <div 
          className="relative w-full h-[82%] overflow-hidden bg-[#3B1366] shadow-md transition-all duration-300 group-hover:shadow-xl"
          style={{
            borderTopLeftRadius: '50% 40%',
            borderTopRightRadius: '50% 40%',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            border: '2px solid #D4AF37'
          }}
        >
          {/* Inner Dashed Gold Ring */}
          <div 
            className="absolute inset-1 pointer-events-none z-10"
            style={{
              borderTopLeftRadius: '50% 40%',
              borderTopRightRadius: '50% 40%',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
              border: '1px dashed rgba(243, 229, 171, 0.6)'
            }}
          />

          {/* Textile / Fabric Close-up Photograph */}
          <img 
            src={craft.image} 
            alt={craft.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115 filter group-hover:contrast-105"
            loading="lazy"
          />

          {/* Vignette Overlay in Royal Purple */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B4C]/70 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Lower Scalloped Royal Purple Plinth / Label Tab */}
        <div 
          className="relative -mt-6 z-20 w-[92%] bg-[#53208C] text-center py-2 px-2.5 shadow-lg border border-[#D4AF37] transition-colors duration-300 group-hover:bg-[#3B1366]"
          style={{
            borderRadius: '4px 4px 16px 16px'
          }}
        >
          {/* Diamond Gold Notch Accent */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#D4AF37] rotate-45 border border-[#53208C]" />
          
          <h4 className="font-serif text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider text-[#FFFFFF] uppercase whitespace-nowrap overflow-hidden text-ellipsis">
            {craft.catchphrase}
          </h4>
          <p className="text-[10px] sm:text-xs text-[#D4AF37] font-serif tracking-widest uppercase font-medium">
            {craft.name}
          </p>
        </div>
      </div>

      {/* Sub-label under plinth */}
      <div className="mt-2 text-center">
        <span className="text-xs sm:text-sm font-semibold text-[#53208C] group-hover:text-[#D4AF37] transition-colors border-b border-transparent group-hover:border-[#D4AF37]">
          {craft.subName || `${craft.name} Sarees`}
        </span>
      </div>
    </Link>
  );
};
