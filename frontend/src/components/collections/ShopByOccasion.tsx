import React from 'react';
import { Link } from 'react-router-dom';
import { SectionDivider } from '../decorative/SectionDivider';

export const ShopByOccasion: React.FC = () => {
  const weddingStyles = [
    {
      id: 'bride',
      title: 'The Bride',
      subtitle: 'Made For The Big Day',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80',
      slug: 'wedding',
    },
    {
      id: 'bridesmaid',
      title: 'The Bridesmaid',
      subtitle: "For The Bride's Crew",
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=700&q=80',
      slug: 'wedding',
    },
    {
      id: 'family',
      title: 'The Family',
      subtitle: 'For Every Sacred Celebration',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80',
      slug: 'festive',
    },
    {
      id: 'guest',
      title: 'Wedding Guest Edit',
      subtitle: 'Looks For Every Function',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
      slug: 'designer',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionDivider 
          title="Wedding Styles For Everyone" 
          subtitle="Auspicious Drapes Curated For The Bride, Family & Festive Soirées"
          ornament="lotus"
        />

        {/* 4 Capsule Arch Cards (Directly matching Reference Screenshot Page 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {weddingStyles.map((item) => (
            <Link
              key={item.id}
              to={`/collections/${item.slug}`}
              className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2.5"
            >
              {/* Capsule Arch Top Card Frame with Metallic Gold Border */}
              <div 
                className="relative aspect-[3/5] w-full overflow-hidden bg-[#3B1366] shadow-xl border-2 border-[#D4AF37] group-hover:border-[#F3E5AB] transition-colors"
                style={{
                  borderTopLeftRadius: '9999px',
                  borderTopRightRadius: '9999px',
                  borderBottomLeftRadius: '8px',
                  borderBottomRightRadius: '8px',
                }}
              >
                {/* Inner Dashed Gold Rule */}
                <div 
                  className="absolute inset-1.5 pointer-events-none z-10"
                  style={{
                    borderTopLeftRadius: '9999px',
                    borderTopRightRadius: '9999px',
                    borderBottomLeftRadius: '6px',
                    borderBottomRightRadius: '6px',
                    border: '1px dashed rgba(212, 175, 55, 0.4)'
                  }}
                />

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />

                {/* Deep Royal Purple Gradient Overlay at Bottom */}
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#2A0B4C] via-[#3B1366]/80 to-transparent pointer-events-none" />

                {/* Content Overlay at Bottom (as in Reference Screenshot Page 2) */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-center text-[#FAF7F2] z-20">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-[#FFFFFF] drop-shadow-sm group-hover:text-gold-gradient transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#F4EFE6]/90 mt-1 font-light tracking-wider">
                    {item.subtitle}
                  </p>
                  
                  <div className="mt-3 inline-block bg-[#53208C] group-hover:bg-[#D4AF37] text-[#FAF7F2] group-hover:text-[#2A0B4C] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#D4AF37] transition-all shadow-md">
                    Shop Now
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
