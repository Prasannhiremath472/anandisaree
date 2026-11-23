import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { SectionDivider } from '../decorative/SectionDivider';

export const ShopByCategory: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Indian Filigree Divider */}
        <SectionDivider 
          title="Shop By Category" 
          subtitle="Explore Authentic Maharashtrian Weaves & Royal Silhouettes"
          ornament="mandala"
        />

        {/* 6 Visual Scalloped Medallion Category Cards (Reference Screenshot Page 1) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mt-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/collections/${category.slug}`}
              className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 focus:outline-none"
            >
              {/* Custom 8-Lobed Scalloped Indian Medallion Shape */}
              <div className="relative w-36 sm:w-40 md:w-44 aspect-square flex items-center justify-center p-2">
                
                {/* SVG Decorative 8-Lobed Gold Border Frame (Page 1) */}
                <svg 
                  viewBox="0 0 160 160" 
                  className="absolute inset-0 w-full h-full text-[#D4AF37] pointer-events-none group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                  fill="none"
                >
                  {/* Outer 8-scalloped petals outline */}
                  <path 
                    d="
                      M 80,10 
                      C 95,10 108,18 116,28 
                      C 126,20 140,24 146,36 
                      C 152,48 148,62 150,76 
                      C 152,90 146,104 136,114 
                      C 142,126 134,140 120,146 
                      C 106,152 92,148 80,150 
                      C 68,148 54,152 40,146 
                      C 26,140 18,126 24,114 
                      C 14,104 8,90 10,76 
                      C 12,62 8,48 14,36 
                      C 20,24 34,20 44,28 
                      C 52,18 65,10 80,10 Z
                    " 
                    stroke="#D4AF37" 
                    strokeWidth="2.5" 
                    fill="#3B1366" 
                  />
                  {/* Inner Dashed Line */}
                  <circle cx="80" cy="80" r="58" stroke="#F3E5AB" strokeWidth="1" strokeDasharray="3 3" />
                </svg>

                {/* Circular Masked Model / Fabric Image inside the Medallion */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 rounded-full overflow-hidden shadow-inner border border-[#D4AF37]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-115"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              </div>

              {/* Category Name & Count */}
              <div className="mt-2 text-center">
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#53208C] group-hover:text-[#D4AF37] transition-colors leading-tight uppercase tracking-wider">
                  {category.name}
                </h3>
                <span className="text-[10px] sm:text-[11px] text-[#5E4675] tracking-wider block mt-0.5 font-medium">
                  {category.highlightText}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
