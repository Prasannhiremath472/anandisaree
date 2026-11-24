import React from 'react';
import { CornerFlourish } from './CornerFlourish';

interface CurvedHeritagePanelProps {
  children: React.ReactNode;
  className?: string;
  curveType?: 'arch-up' | 'arch-down' | 'scalloped' | 'gentle-curve';
  showFlourishes?: boolean;
  showFloralTexture?: boolean;
  outlineColor?: string;
}

export const CurvedHeritagePanel: React.FC<CurvedHeritagePanelProps> = ({
  children,
  className = '',
  curveType = 'arch-up',
  showFlourishes = true,
  showFloralTexture = true,
  outlineColor = '#D4AF37',
}) => {
  return (
    <div className={`relative w-full overflow-hidden bg-[#FAF7F2] ${className}`}>
      {/* Background Vintage Botanical / Parchment Etchings on sides */}
      {showFloralTexture && (
        <>
          <div 
            className="absolute left-0 top-0 bottom-0 w-48 md:w-80 pointer-events-none opacity-15 bg-contain bg-no-repeat bg-left-center"
            style={{
              backgroundImage: `radial-gradient(circle at 10% 50%, rgba(83,32,140,0.15) 0%, transparent 60%)`
            }}
            aria-hidden="true"
          >
            {/* Subtle Paisley / Vine Illustration on Left */}
            <svg viewBox="0 0 200 300" className="w-full h-full text-[#53208C]" fill="currentColor">
              <path d="M 0,50 Q 80,100 30,180 Q 90,200 10,280 L 0,300 Z" opacity="0.3" />
              <circle cx="50" cy="120" r="15" opacity="0.2" />
              <circle cx="70" cy="190" r="25" opacity="0.2" />
            </svg>
          </div>

          <div 
            className="absolute right-0 top-0 bottom-0 w-48 md:w-80 pointer-events-none opacity-15 bg-contain bg-no-repeat bg-right-center"
            style={{
              backgroundImage: `radial-gradient(circle at 90% 50%, rgba(83,32,140,0.15) 0%, transparent 60%)`
            }}
            aria-hidden="true"
          >
            {/* Subtle Paisley / Vine Illustration on Right */}
            <svg viewBox="0 0 200 300" className="w-full h-full text-[#53208C] scale-x-[-1]" fill="currentColor">
              <path d="M 0,50 Q 80,100 30,180 Q 90,200 10,280 L 0,300 Z" opacity="0.3" />
              <circle cx="50" cy="120" r="15" opacity="0.2" />
              <circle cx="70" cy="190" r="25" opacity="0.2" />
            </svg>
          </div>
        </>
      )}

      {/* Decorative Corner Flourishes */}
      {showFlourishes && (
        <>
          <CornerFlourish position="top-left" className="top-2 left-2" size={48} color="#D4AF37" />
          <CornerFlourish position="top-right" className="top-2 right-2" size={48} color="#D4AF37" />
        </>
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
        {children}
      </div>

      {/* Curved Heritage Lower Boundary SVG */}
      <div className="relative w-full -mt-px pointer-events-none z-20 overflow-hidden leading-none">
        {curveType === 'arch-up' && (
          <svg 
            viewBox="0 0 1440 80" 
            className="w-full h-8 sm:h-12 md:h-16 lg:h-20 fill-[#FAF7F2] text-transparent"
            preserveAspectRatio="none"
          >
            {/* Background fills the below area */}
            <path 
              d="M 0,0 C 360,65 1080,65 1440,0 L 1440,80 L 0,80 Z" 
              fill="#FAF7F2" 
            />
            {/* Antique gold accent line */}
            <path 
              d="M 0,0 C 360,65 1080,65 1440,0" 
              stroke={outlineColor} 
              strokeWidth="1.5" 
              fill="none" 
              opacity="0.85" 
            />
            {/* Inner dashed gold line */}
            <path 
              d="M 0,4 C 360,69 1080,69 1440,4" 
              stroke="#D4AF37" 
              strokeWidth="0.75" 
              strokeDasharray="4 4" 
              fill="none" 
              opacity="0.7" 
            />
          </svg>
        )}

        {curveType === 'arch-down' && (
          <svg 
            viewBox="0 0 1440 60" 
            className="w-full h-6 sm:h-10 md:h-14 fill-[#FAF7F2]"
            preserveAspectRatio="none"
          >
            <path 
              d="M 0,0 L 0,15 C 480,55 960,55 1440,15 L 1440,0 Z" 
              fill="#FAF7F2" 
            />
            <path 
              d="M 0,15 C 480,55 960,55 1440,15" 
              stroke={outlineColor} 
              strokeWidth="1.5" 
              fill="none" 
              opacity="0.8" 
            />
          </svg>
        )}

        {curveType === 'gentle-curve' && (
          <svg 
            viewBox="0 0 1440 50" 
            className="w-full h-6 sm:h-8 md:h-12"
            preserveAspectRatio="none"
          >
            <path 
              d="M 0,25 Q 720,50 1440,25 L 1440,50 L 0,50 Z" 
              fill="#FAF7F2" 
            />
            <path 
              d="M 0,25 Q 720,50 1440,25" 
              stroke={outlineColor} 
              strokeWidth="1.2" 
              fill="none" 
              opacity="0.7" 
            />
          </svg>
        )}
      </div>
    </div>
  );
};
