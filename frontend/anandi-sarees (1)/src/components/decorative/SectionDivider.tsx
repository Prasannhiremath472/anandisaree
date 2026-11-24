import React from 'react';

interface SectionDividerProps {
  className?: string;
  title?: string;
  subtitle?: string;
  ornament?: 'mandala' | 'lotus' | 'kalash' | 'simple';
  light?: boolean;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  className = '',
  title,
  subtitle,
  ornament = 'mandala',
  light = false,
}) => {
  const purpleColor = light ? '#FAF7F2' : '#53208C';
  const goldColor = '#D4AF37';

  return (
    <div className={`flex flex-col items-center justify-center text-center my-6 select-none ${className}`}>
      {/* Central Royal Indian Ornament with dividing filigree wings */}
      <div className="flex items-center justify-center w-full max-w-xl px-4">
        {/* Left Wing */}
        <div className="flex-1 flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-[#53208C]" />
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] ml-1.5 shrink-0 shadow-2xs" />
        </div>

        {/* Center Medallion */}
        <div className="mx-3 shrink-0 text-[#53208C]">
          {ornament === 'mandala' && (
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="19" cy="19" r="16" stroke={goldColor} strokeWidth="1.2" strokeDasharray="2 2" />
              <circle cx="19" cy="19" r="11" stroke={purpleColor} strokeWidth="1.5" />
              {/* 8-Petal Star / Floral */}
              <path d="M19 4 L19 34 M4 19 L34 19" stroke={goldColor} strokeWidth="1" opacity="0.85" />
              <path d="M8 8 L30 30 M8 30 L30 8" stroke={purpleColor} strokeWidth="1" opacity="0.6" />
              <circle cx="19" cy="19" r="4" fill={goldColor} />
              <circle cx="19" cy="19" r="1.8" fill="#53208C" />
            </svg>
          )}

          {ornament === 'lotus' && (
            <svg width="42" height="30" viewBox="0 0 42 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 3 C17 10 17 21 21 26 C25 21 25 10 21 3 Z" fill={goldColor} />
              <path d="M21 13 C13 10 7 15 11 23 C15 24 19 20 21 13 Z" fill={purpleColor} opacity="0.9" />
              <path d="M21 13 C29 10 35 15 31 23 C27 24 23 20 21 13 Z" fill={purpleColor} opacity="0.9" />
              <circle cx="21" cy="24" r="2.5" fill={goldColor} />
            </svg>
          )}

          {ornament === 'simple' && (
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rotate-45 border border-[#53208C] inline-block" />
              <span className="w-3 h-3 rotate-45 bg-[#D4AF37] inline-block shadow-2xs" />
              <span className="w-2 h-2 rotate-45 border border-[#53208C] inline-block" />
            </div>
          )}
        </div>

        {/* Right Wing */}
        <div className="flex-1 flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] mr-1.5 shrink-0 shadow-2xs" />
          <div className="w-full h-px bg-gradient-to-l from-transparent via-[#D4AF37]/40 to-[#53208C]" />
        </div>
      </div>

      {title && (
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#53208C] mt-3 font-medium tracking-wide">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-xs md:text-sm text-[#5E4675] max-w-lg mt-1 tracking-wider uppercase font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
};
