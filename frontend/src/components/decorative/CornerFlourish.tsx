import React from 'react';

interface CornerFlourishProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
  color?: string;
}

export const CornerFlourish: React.FC<CornerFlourishProps> = ({
  position = 'top-left',
  className = '',
  size = 54,
  color = '#D4AF37',
}) => {
  const rotationClass = {
    'top-left': '',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  return (
    <div 
      className={`absolute pointer-events-none ${rotationClass} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-90 drop-shadow-xs">
        {/* Outer Corner Frame Accent in Gold */}
        <path d="M 6 42 L 6 12 C 6 8.7 8.7 6 12 6 L 42 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 12 48 L 12 18 C 12 14.7 14.7 12 18 12 L 48 12" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 3" />
        
        {/* Stylized Royal Keri / Paisley Corner Flourish */}
        <path 
          d="M 18 18 C 32 18 44 24 48 36 C 50 48 40 56 32 52 C 24 48 26 38 34 36 C 38 35 40 38 39 40" 
          stroke={color} 
          strokeWidth="1.8" 
          strokeLinecap="round" 
        />
        {/* Decorative Lotus Petals */}
        <path d="M 22 22 Q 35 28 42 22" stroke={color} strokeWidth="1.2" fill="none" />
        <path d="M 22 22 Q 28 35 22 42" stroke={color} strokeWidth="1.2" fill="none" />
        
        {/* Accents */}
        <circle cx="8" cy="8" r="3" fill={color} />
        <circle cx="20" cy="20" r="2.2" fill="#53208C" stroke={color} strokeWidth="1" />
        <circle cx="50" cy="12" r="1.8" fill={color} />
        <circle cx="12" cy="50" r="1.8" fill={color} />
      </svg>
    </div>
  );
};
