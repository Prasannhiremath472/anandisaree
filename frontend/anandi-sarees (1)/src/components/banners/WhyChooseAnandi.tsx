import React from 'react';
import { Award, Feather, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import { SectionDivider } from '../decorative/SectionDivider';

export const WhyChooseAnandi: React.FC = () => {
  const pillars = [
    {
      icon: <Award className="w-8 h-8 text-[#D4AF37]" />,
      title: 'Authentic Silk Mark Certified',
      description: 'Every pure silk Paithani and handloom saree carries the official Silk Mark certification of authenticity.',
    },
    {
      icon: <Feather className="w-8 h-8 text-[#D4AF37]" />,
      title: 'Yeola & Paithan Weavers',
      description: 'Direct collaboration with over 200 master weaver families, preserving 2000-year-old pit-loom heritage.',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-[#D4AF37]" />,
      title: 'Pure Gold & Silver Zari',
      description: 'Handwoven with certified electroplated zari threads that retain their royal luster through generations.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />,
      title: 'Zero-Middlemen Pricing',
      description: 'Ethical loom-to-wardrobe pricing that directly enriches our artisan clusters in rural Maharashtra.',
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-[#D4AF37]" />,
      title: 'Bespoke Draping Care',
      description: 'Complimentary blouse cutting guidance, roll-press finishing, and personalized virtual video shopping.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionDivider
          title="Why Choose Anandi Sarees"
          subtitle="Our Sacred Commitment to Maharashtrian Heritage & Craft Integrity"
          ornament="mandala"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] p-6 rounded-xs border border-[#E8DDF0] text-center shadow-xs hover:shadow-xl hover:border-[#D4AF37] transition-all flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-full bg-[#3B1366] border border-[#D4AF37] flex items-center justify-center mb-4 shadow-md">
                {pillar.icon}
              </div>

              <div>
                <h4 className="font-serif text-base font-bold text-[#53208C] leading-snug">
                  {pillar.title}
                </h4>
                <p className="text-xs text-[#5E4675] mt-2 leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>

              <div className="w-8 h-0.5 bg-[#D4AF37] mt-4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
