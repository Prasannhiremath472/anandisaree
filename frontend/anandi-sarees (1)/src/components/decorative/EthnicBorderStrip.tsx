import React from 'react';

interface EthnicBorderStripProps {
  className?: string;
  variant?: 'geometric' | 'floral' | 'beaded';
  color?: string;
  goldAccent?: boolean;
}

export const EthnicBorderStrip: React.FC<EthnicBorderStripProps> = ({
  className = '',
  variant = 'geometric',
  color = '#53208C',
  goldAccent = true,
}) => {
  const goldColor = '#D4AF37';

  return (
    <div 
      className={`w-full overflow-hidden leading-none select-none py-1.5 opacity-95 ${className}`}
      aria-hidden="true"
    >
      <svg 
        className="w-full h-4 sm:h-5 text-current" 
        preserveAspectRatio="none" 
        viewBox="0 0 1200 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`ethnic-pat-royal-${variant}`} width="40" height="24" patternUnits="userSpaceOnUse">
            {variant === 'geometric' && (
              <>
                {/* Top and bottom metallic gold rule lines */}
                <line x1="0" y1="2" x2="40" y2="2" stroke={goldAccent ? goldColor : color} strokeWidth="1" strokeOpacity="0.8" />
                <line x1="0" y1="22" x2="40" y2="22" stroke={goldAccent ? goldColor : color} strokeWidth="1" strokeOpacity="0.8" />
                
                {/* Interlocking Diamond / Temple Border Motif */}
                <polygon points="20,4 32,12 20,20 8,12" stroke={goldColor} strokeWidth="1.2" fill="none" />
                <polygon points="20,7 27,12 20,17 13,12" fill={color} fillOpacity="0.85" />
                <circle cx="20" cy="12" r="2" fill={goldColor} />
                
                {/* Connecting Beads and small side triangles */}
                <circle cx="0" cy="12" r="1.8" fill={goldColor} />
                <circle cx="40" cy="12" r="1.8" fill={goldColor} />
                <circle cx="6" cy="6" r="1" fill={color} fillOpacity="0.8" />
                <circle cx="34" cy="6" r="1" fill={color} fillOpacity="0.8" />
                <circle cx="6" cy="18" r="1" fill={color} fillOpacity="0.8" />
                <circle cx="34" cy="18" r="1" fill={color} fillOpacity="0.8" />
                
                {/* Micro chevron accents */}
                <path d="M 0,4 L 4,12 L 0,20" stroke={goldColor} strokeWidth="0.8" fill="none" />
                <path d="M 40,4 L 36,12 L 40,20" stroke={goldColor} strokeWidth="0.8" fill="none" />
              </>
            )}

            {variant === 'floral' && (
              <>
                <line x1="0" y1="1" x2="40" y2="1" stroke={goldColor} strokeWidth="0.8" />
                <line x1="0" y1="23" x2="40" y2="23" stroke={goldColor} strokeWidth="0.8" />
                {/* Royal Lotus / Floral repeating motif */}
                <path d="M 20,5 C 24,9 24,15 20,19 C 16,15 16,9 20,5 Z" fill={color} stroke={goldColor} strokeWidth="0.9" />
                <path d="M 20,12 C 14,8 10,12 12,16 C 15,16 18,14 20,12 Z" fill={goldColor} fillOpacity="0.4" />
                <path d="M 20,12 C 26,8 30,12 28,16 C 25,16 22,14 20,12 Z" fill={goldColor} fillOpacity="0.4" />
                <circle cx="20" cy="12" r="1.8" fill={goldColor} />
                <circle cx="0" cy="12" r="1.5" fill={color} />
                <circle cx="40" cy="12" r="1.5" fill={color} />
              </>
            )}

            {variant === 'beaded' && (
              <>
                <line x1="0" y1="3" x2="40" y2="3" stroke={goldColor} strokeWidth="0.6" strokeOpacity="0.7" />
                <line x1="0" y1="21" x2="40" y2="21" stroke={goldColor} strokeWidth="0.6" strokeOpacity="0.7" />
                <circle cx="10" cy="12" r="2.5" stroke={goldColor} strokeWidth="0.9" fill="none" />
                <circle cx="20" cy="12" r="3.5" stroke={goldColor} strokeWidth="1.2" fill={color} fillOpacity="0.9" />
                <circle cx="20" cy="12" r="1.8" fill={goldColor} />
                <circle cx="30" cy="12" r="2.5" stroke={goldColor} strokeWidth="0.9" fill="none" />
              </>
            )}
          </pattern>
        </defs>
        <rect width="100%" height="24" fill={`url(#ethnic-pat-royal-${variant})`} />
      </svg>
    </div>
  );
};
