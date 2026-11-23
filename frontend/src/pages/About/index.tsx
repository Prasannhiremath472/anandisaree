import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';
import { EthnicBorderStrip } from '../../components/decorative/EthnicBorderStrip';
import { SectionDivider } from '../../components/decorative/SectionDivider';
import { CornerFlourish } from '../../components/decorative/CornerFlourish';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#3B1366] via-[#53208C] to-[#3B1366] text-[#FAF7F2] py-16 sm:py-24 overflow-hidden border-b border-[#D4AF37]/40">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=80)` }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">
            The House of Anandi
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#FFFFFF]">
            Tradition Woven With Elegance
          </h1>
          <p className="text-xs sm:text-base text-[#FAF2DE] mt-4 max-w-2xl mx-auto leading-relaxed font-light">
            Reviving centuries of royal Maharashtrian handlooms — from the ancient pit-looms of Yeola to the timeless bridal drapes of Maharashtra.
          </p>
        </div>
      </div>

      <EthnicBorderStrip variant="floral" color="#D4AF37" className="border-b border-[#D4AF37]/30" />

      {/* Chapter 1: The Origin Story */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-[#3B1366]/90 leading-relaxed font-light">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold block">
              Chapter I • Our Genesis
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#3B1366] leading-tight">
              A Reverence for the Sacred Weft
            </h2>
            <p>
              Founded in Maharashtra with a devotion to authentic textile heritage, <strong>ANANDI SAREES</strong> was conceived to preserve the dwindling legacy of traditional Indian handlooms while dressing the modern woman with unpretentious royal grace.
            </p>
            <p>
              In Sanskrit, <em>Anandi</em> signifies pure joy and transcendent bliss. For centuries, a Maharashtrian saree has never been merely garments of cloth; it is an auspicious mantle presented during life’s most sacred milestones — from the radiant morning of Gudi Padwa to the regal Kashta drape of a traditional wedding.
            </p>
            <p>
              Our master weavers in Yeola and Paithan still employ wooden pit-looms where each meter of pure silk and gold zari requires thousands of hand-guided shuttles, taking up to 45 days to complete a single heirloom Paithani.
            </p>
          </div>

          <div className="lg:col-span-6 relative">
            <CornerFlourish position="top-left" className="-top-3 -left-3" size={48} color="#D4AF37" />
            <CornerFlourish position="bottom-right" className="-bottom-3 -right-3" size={48} color="#D4AF37" />
            <div className="aspect-[4/3] rounded-xs overflow-hidden border-2 border-[#D4AF37]/50 shadow-xl bg-[#3B1366]">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                alt="Yeola Paithani Zari Pallu"
                className="w-full h-full object-cover filter contrast-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chapter 2: The Three Heritage Pillars */}
      <div className="bg-[#FFFFFF] border-y border-[#D4AF37]/30 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider
            title="The Three Pillars of Anandi"
            subtitle="Guiding Every Warp and Weft We Create"
            ornament="mandala"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-center">
            <div className="p-6 bg-[#FAF7F2] rounded-xs border border-[#D4AF37]/40 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#FAF2DE] flex items-center justify-center mx-auto mb-4 text-[#53208C] border border-[#D4AF37]/40">
                <Feather className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3B1366]">
                Yeola & Paithan Cooperatives
              </h3>
              <p className="text-xs text-[#3B1366]/80 mt-2 leading-relaxed">
                Direct partnerships with generational artisan guilds, guaranteeing fair living wages, sustainable looms, and dignity of traditional craftsmanship.
              </p>
            </div>

            <div className="p-6 bg-[#FAF7F2] rounded-xs border border-[#D4AF37]/40 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#FAF2DE] flex items-center justify-center mx-auto mb-4 text-[#53208C] border border-[#D4AF37]/40">
                <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3B1366]">
                Silk Mark Certified Purity
              </h3>
              <p className="text-xs text-[#3B1366]/80 mt-2 leading-relaxed">
                Every pure silk saree is individually tested and tagged with the official Silk Mark of India, assuring 100% natural silk and electroplated zari authenticity.
              </p>
            </div>

            <div className="p-6 bg-[#FAF7F2] rounded-xs border border-[#D4AF37]/40 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#FAF2DE] flex items-center justify-center mx-auto mb-4 text-[#53208C] border border-[#D4AF37]/40">
                <HeartHandshake className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3B1366]">
                Bespoke Draping Heritage
              </h3>
              <p className="text-xs text-[#3B1366]/80 mt-2 leading-relaxed">
                From video shopping to custom blouse tailoring and traditional fall-pico finishing, our boutique curators treat every customer like family.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 text-center max-w-2xl mx-auto px-4">
        <h2 className="font-serif text-3xl font-medium text-[#3B1366]">
          Step Into the World of Anandi
        </h2>
        <p className="text-xs sm:text-sm text-[#3B1366]/80 mt-2 font-light">
          Explore our signature Paithani, Nauvari, and handloom silk catalog.
        </p>
        <div className="mt-6">
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#53208C] via-[#6B2BAF] to-[#53208C] hover:from-[#3B1366] hover:to-[#53208C] text-[#FAF7F2] text-xs font-semibold px-8 py-3.5 uppercase tracking-wider transition-colors shadow-sm border border-[#D4AF37]/40"
          >
            <span>Explore Handloom Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
