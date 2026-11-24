import React from 'react';
import { Link } from 'react-router-dom';

interface AnandiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'compact' | 'light';
}

export const AnandiLogo: React.FC<AnandiLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const heightClass = {
    sm: 'h-11 sm:h-12',
    md: 'h-14 sm:h-16 md:h-18',
    lg: 'h-20 sm:h-24',
  }[size];

  return (
    <Link to="/" className={`inline-block select-none group transition-transform duration-300 hover:scale-102 ${className}`}>
      <div className="flex flex-col items-center">
        {/* Render Original Authentic Anandi Sarees Logo */}
        <div className="relative overflow-hidden rounded-xs p-1">
          <img
            src="/images/anandi-logo.webp"
            alt="ANANDI SAREES — Premium Collection"
            className={`${heightClass} w-auto object-contain drop-shadow-md`}
          />
        </div>
      </div>
    </Link>
  );
};
