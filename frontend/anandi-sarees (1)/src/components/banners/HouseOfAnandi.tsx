import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HouseOfAnandi: React.FC = () => {
  const galleryItems = [
    {
      title: 'Helping you choose',
      desc: 'Personalized boutique consultation',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Our boutique',
      desc: 'Heritage flagships in Pune & Mumbai',
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Design studio',
      desc: 'Reviving Peshwa motifs & colorways',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Zari weaving',
      desc: 'Authentic metallic gold jacquard',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'On the handloom',
      desc: 'Generational master artisans in Yeola',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Quality inspection',
      desc: 'Every drape meticulously verified',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-y border-[#D4AF37]/30 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Split-Screen Editorial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-14 border-b border-[#D4AF37]/30">
          
          {/* Left: Traditional Loom Weaving Large Image */}
          <div className="lg:col-span-7">
            <div className="relative rounded-xs overflow-hidden shadow-2xl border-2 border-[#D4AF37] bg-[#3B1366] aspect-[16/10]">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80"
                alt="Traditional Saree Handloom Weaving"
                className="w-full h-full object-cover filter contrast-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B4C]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 text-white text-xs bg-[#53208C]/90 px-3 py-1 rounded-xs backdrop-blur-xs border border-[#D4AF37]">
                Yeola Pit-Loom • Handcrafted Royal Heritage
              </div>
            </div>
          </div>

          {/* Right: Editorial Brand Story in Royal Purple */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-1">
              House of Anandi
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#53208C] leading-tight">
              The Heritage Behind <br />
              <span className="italic font-normal text-gold-gradient">Every Drape</span>
            </h2>

            <div className="space-y-3.5 text-xs sm:text-sm text-[#5E4675] mt-4 leading-relaxed font-light">
              <p>
                <strong className="font-semibold text-[#53208C]">ANANDI SAREES</strong> isn’t just a label — it is a living celebration of Maharashtra's rich handloom culture. Inspired by the Sanskrit word for pure joy and bliss, each drape brings the royal legacy of the Marathas into modern celebrations.
              </p>
              <p>
                Working hand-in-hand with generational weaving families across Yeola, Paithan, and Solapur, our loomed creations preserve the sacred Mor-Bangadi peacock motifs, the intricate rudraksha temple borders, and the unmatched luster of pure mulberry silk.
              </p>
              <p>
                From heirloom wedding Nauvari shalus to effortless everyday handspun cotton, every saree is woven with integrity, respect for artisan livelihoods, and uncompromised craftsmanship.
              </p>
            </div>

            <div className="mt-6">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#53208C] hover:bg-[#3B1366] text-[#FAF7F2] text-xs font-bold px-7 py-3 rounded-xs uppercase tracking-[0.16em] transition-all shadow-md hover:shadow-xl border border-[#D4AF37]"
              >
                <span>Explore Our Story</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Lower Editorial Gallery: House of Anandi 6 Pillars */}
        <div className="pt-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#53208C]">
              House Of Anandi
            </h3>
            <p className="text-xs sm:text-sm text-[#5E4675] mt-1 max-w-2xl mx-auto leading-relaxed font-light">
              We invite you to be a part of our cherished family, where tradition meets modern grace, and every saree carries the essence of timeless elegance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryItems.map((item, idx) => (
              <div 
                key={idx}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative w-full aspect-square rounded-xs overflow-hidden border border-[#D4AF37]/50 bg-[#3B1366] shadow-sm group-hover:border-[#53208C] transition-colors">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="mt-2.5">
                  <h4 className="font-serif text-sm font-semibold text-[#53208C] group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-[#5E4675] mt-0.5 line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
