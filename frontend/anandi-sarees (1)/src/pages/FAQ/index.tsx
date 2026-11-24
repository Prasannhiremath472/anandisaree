import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { EthnicBorderStrip } from '../../components/decorative/EthnicBorderStrip';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: 'Heritage & Craft',
      question: 'A Whisper of Luxurious Elegance: What makes an authentic Yeola Paithani unique?',
      answer: 'An authentic Yeola Paithani is characterized by pure natural mulberry silk and certified zari woven on traditional wooden pit-looms. The defining hallmark is its double-sided tapestry weave where the motif looks virtually identical on both the front and reverse side without raw loose threads. The iconic Mor-Bangadi (peacock in bangle) and Asawali (flowering vine) pallus take up to 45 days of painstaking manual shuttle work.'
    },
    {
      category: 'Heritage & Craft',
      question: 'Where Devotion Blends with Beauty: What is the significance of the Narayan Peth temple border?',
      answer: 'Narayan Peth sarees feature a centuries-old heritage combining lightweight silk-cotton bodies with rich contrasting double-shaded borders adorned with the sacred Rudraksha temple tooth motifs woven in gold zari. Traditionally favored across Maharashtra for morning Ganesh poojas, Haldi ceremonies, and Gudi Padwa.'
    },
    {
      category: 'Heritage & Craft',
      question: 'A Symphony of Silk & Zari: How do Nauvari (9-Yard) sarees differ from standard sarees?',
      answer: 'A standard saree measures 5.5 to 6.3 meters (6 yards), whereas an authentic Nauvari saree spans 8.2 to 8.5 meters (9 yards). This extra length allows the wearer to drape the traditional Maharashtrian Kashta style with dhoti pleats tucked behind, symbolizing both regal elegance and historical martial valor of Maratha women.'
    },
    {
      category: 'Purity & Certification',
      question: 'How can I verify the Silk Mark authenticity of my Anandi saree?',
      answer: 'Every pure silk saree from Anandi Sarees comes stitched with an authorized, numbered Silk Mark label issued by the Silk Mark Organisation of India. Each label carries a unique hologram and QR code that can be verified online or via SMS.'
    },
    {
      category: 'Shopping & Customization',
      question: 'What is included with my saree? Is blouse fabric included?',
      answer: 'All our sarees include an unstitched 0.8m running blouse piece or contrasting pure brocade fabric with matching zari sleeve borders. During checkout or on the product page, you can also opt for our premium stitched blouse tailoring or bespoke sizing service.'
    },
    {
      category: 'Shopping & Customization',
      question: 'How does the "Shop Via Video Call" consultation work?',
      answer: 'You can book a complimentary 30-minute virtual appointment with our boutique draping specialists. Over WhatsApp or Google Meet, our curator will showcase the sarees in natural daylight, unfold the pallu, explain the weight, and drape it over a mannequin to help you make an effortless choice.'
    },
    {
      category: 'Delivery & Shipping',
      question: 'What are the delivery timelines and shipping charges across India?',
      answer: 'We provide complimentary insured express air shipping on all orders across India. Orders are dispatched within 24 to 48 hours. Delivery takes 2-4 business days for major metropolitan hubs and 4-7 days for interior regions.'
    },
    {
      category: 'Care & Preservation',
      question: 'How should I preserve and care for my heirloom silk sarees?',
      answer: 'Always dry-clean your pure silk and zari sarees. Never spray water or perfumes directly onto the zari work. Store your sarees wrapped in a breathable muslin or pure cotton saree bag in a cool, dry wardrobe, and air them out in the shade once every six months.'
    }
  ];

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3B1366] via-[#53208C] to-[#3B1366] text-[#FAF7F2] py-12 sm:py-16 text-center border-b border-[#D4AF37]/40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="w-12 h-12 rounded-full bg-[#3B1366] border border-[#D4AF37] flex items-center justify-center mx-auto mb-3 shadow-md">
            <HelpCircle className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-wide">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#FAF2DE] mt-2 font-light max-w-xl mx-auto">
            Everything you need to know about our Yeola pit-looms, pure Silk Mark authenticity, Nauvari drapes, and delivery guarantees.
          </p>
        </div>
      </div>

      <EthnicBorderStrip variant="geometric" color="#D4AF37" className="border-b border-[#D4AF37]/30" />

      {/* FAQ Accordion List (Screenshot 2 styling) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xs overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#FAF7F2]/50 transition-colors"
                >
                  <span className="font-serif text-base sm:text-lg font-semibold text-[#3B1366] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#53208C]' : ''
                    }`} 
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-[#3B1366]/90 leading-relaxed border-t border-[#FAF7F2] animate-fadeIn font-light">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
