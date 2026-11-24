import React from 'react';
import { Link } from 'react-router-dom';

interface OrnamentalModelFrameProps {
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
  variant?: 'medallion' | 'jharokha' | 'arch';
  className?: string;
}

export const OrnamentalModelFrame: React.FC<OrnamentalModelFrameProps> = ({
  image,
  title,
  subtitle = 'COLLECTIONS',
  link = '/collections/all',
  variant = 'jharokha',
  className = '',
}) => {
  if (variant === 'medallion') {
    return (
      <Link 
        to={link}
        className={`group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1.5 ${className}`}
      >
        <div className="relative p-2 sm:p-3">
          {/* Intricate Outer Mandala Rings in Metallic Gold */}
          <div className="absolute inset-0 rounded-full border border-[#D4AF37]/40 border-dashed group-hover:border-[#D4AF37] transition-colors duration-500 scale-98" />
          <div className="absolute inset-1 sm:inset-1.5 rounded-full border border-[#D4AF37] opacity-80" />
          
          {/* Delicate SVG Mandala Ring around photo */}
          <svg 
            viewBox="0 0 200 200" 
            className="absolute inset-0 w-full h-full pointer-events-none text-[#D4AF37] opacity-85 group-hover:opacity-100 transition-opacity"
          >
            <circle cx="100" cy="100" r="94" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="3 3" fill="none" />
            <circle cx="100" cy="100" r="88" stroke="#D4AF37" strokeWidth="1.2" fill="none" />
            {/* 16 ornamental radial gold beads */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              const x = 100 + 91 * Math.cos(rad);
              const y = 100 + 91 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="1.8" fill="#D4AF37" />;
            })}
          </svg>

          {/* Model Circular Image */}
          <div className="relative w-22 h-22 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-lg border-2 border-[#53208C]">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-108"
              loading="lazy"
            />
          </div>
        </div>

        {title && (
          <div className="mt-1.5 sm:mt-3 text-center">
            <span className="font-serif text-xs sm:text-lg font-semibold text-[#53208C] group-hover:text-[#D4AF37] transition-colors uppercase tracking-wider block truncate max-w-[95px] sm:max-w-none">
              {title}
            </span>
          </div>
        )}
      </Link>
    );
  }

  // Variant "jharokha" — As seen in Reference Screenshot Page 3 ("The House Edit"):
  // Ornate temple arch / scalloped dome top with curved sides, bordered with an antique gold border,
  // and at the bottom a dark royal purple scalloped plinth/tab with gold serif typography
  return (
    <Link 
      to={link}
      className={`group relative flex flex-col items-center justify-end overflow-hidden transition-all duration-300 hover:-translate-y-2 ${className}`}
    >
      {/* Outer Decorative Shape Container */}
      <div className="relative w-44 sm:w-52 md:w-60 h-64 sm:h-76 md:h-84 flex flex-col items-center">
        {/* Scalloped Silhouette Mask Container */}
        <div 
          className="relative w-full h-[85%] overflow-hidden bg-[#3B1366] shadow-xl transition-transform duration-500 group-hover:shadow-2xl"
          style={{
            borderTopLeftRadius: '50% 35%',
            borderTopRightRadius: '50% 35%',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            border: '2.5px solid #D4AF37'
          }}
        >
          {/* Inner Accent Line */}
          <div 
            className="absolute inset-1 pointer-events-none z-10"
            style={{
              borderTopLeftRadius: '50% 35%',
              borderTopRightRadius: '50% 35%',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              border: '1px dashed rgba(212, 175, 55, 0.6)'
            }}
          />

          {/* Model Photograph */}
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />
          {/* Soft royal purple gradient bottom overlay */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#2A0B4C]/80 to-transparent pointer-events-none" />
        </div>

        {/* Lower Scalloped Royal Purple Plinth / Label Tab */}
        <div 
          className="relative -mt-6 z-20 w-[92%] bg-[#53208C] text-center py-2 px-3 shadow-lg transition-colors duration-300 group-hover:bg-[#3B1366] border border-[#D4AF37]"
          style={{
            borderRadius: '4px 4px 18px 18px'
          }}
        >
          {/* Top small decorative gold bead */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#D4AF37] rotate-45 border border-[#53208C]" />

          <h3 className="font-serif text-sm sm:text-base md:text-lg font-bold tracking-wider text-[#FFFFFF] uppercase">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] tracking-widest text-[#D4AF37] font-semibold -mt-0.5 uppercase">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
