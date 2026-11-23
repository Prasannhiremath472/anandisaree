import React from 'react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const InstagramGallery: React.FC = () => {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      caption: '#AnandiBridal • Yeola Pure Paithani in Royal Emerald',
    },
    {
      url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      caption: '#NauvariGrace • Traditional 9-Yard Kashta Drape',
    },
    {
      url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
      caption: '#NarayanPeth • Double Shaded Temple Border Weave',
    },
    {
      url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      caption: '#ArtisanLoom • Pure Handloom Silk from Yeola Pit-Looms',
    },
    {
      url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      caption: '#FestiveAnandi • Metallic Zari Brocade Highlights',
    },
    {
      url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      caption: '#RoyalHeritage • Anandi Sarees Pune Flagship',
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#FAF7F2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#53208C] uppercase tracking-[0.2em] mb-1">
            <InstagramIcon className="w-4 h-4 text-[#D4AF37]" />
            <span>@AnandiSareesOfficial</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#3B1366] font-medium">
            Follow Our Drape Journey
          </h2>
          <p className="text-xs sm:text-sm text-[#3B1366]/80 mt-1 font-light">
            Tag #AnandiSarees to be featured in our royal heritage bride & festive gallery.
          </p>
        </div>

        {/* 6-Image Social Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {images.map((item, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square rounded-xs overflow-hidden border border-[#D4AF37]/40 bg-[#FAF2DE] shadow-xs block"
            >
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />

              {/* Hover Dark Overlay with Instagram Icon & Caption */}
              <div className="absolute inset-0 bg-[#3B1366]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-[#FAF7F2]">
                <InstagramIcon className="w-6 h-6 text-[#D4AF37] mb-1.5" />
                <p className="text-[10px] leading-tight line-clamp-3">
                  {item.caption}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="mt-8 text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-[#53208C] bg-[#FFFFFF] hover:bg-[#53208C] hover:text-[#FFFFFF] text-[#53208C] text-xs font-semibold px-6 py-2.5 rounded-full uppercase tracking-wider transition-colors shadow-2xs"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow Anandi On Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
};
