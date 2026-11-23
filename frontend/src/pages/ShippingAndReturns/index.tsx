import React from 'react';
import { Truck, RefreshCw, Clock } from 'lucide-react';
import { EthnicBorderStrip } from '../../components/decorative/EthnicBorderStrip';

export const ShippingAndReturnsPage: React.FC = () => {
  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3B1366] via-[#53208C] to-[#3B1366] text-[#FAF7F2] py-12 sm:py-16 text-center border-b border-[#D4AF37]/40">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-wide">
            Shipping, Delivery & Returns
          </h1>
          <p className="text-xs sm:text-sm text-[#FAF2DE] mt-2 font-light max-w-xl mx-auto">
            Transparent, insured and worry-free policies designed to honor your trust in Anandi Sarees.
          </p>
        </div>
      </div>

      <EthnicBorderStrip variant="geometric" color="#D4AF37" className="border-b border-[#D4AF37]/30" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        
        {/* Highlight 3-Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] p-6 rounded-xs border border-[#D4AF37]/40 text-center shadow-xs">
            <Truck className="w-8 h-8 text-[#53208C] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#3B1366]">Complimentary Express Shipping</h3>
            <p className="text-xs text-[#3B1366]/80 mt-1">Free insured air delivery on all prepaid domestic saree orders.</p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-xs border border-[#D4AF37]/40 text-center shadow-xs">
            <Clock className="w-8 h-8 text-[#53208C] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#3B1366]">24-48 Hour Dispatch</h3>
            <p className="text-xs text-[#3B1366]/80 mt-1">Prompt roll-pressing, quality inspection and prompt dispatch from Pune/Yeola.</p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-xs border border-[#D4AF37]/40 text-center shadow-xs">
            <RefreshCw className="w-8 h-8 text-[#53208C] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#3B1366]">7 Days Return Guarantee</h3>
            <p className="text-xs text-[#3B1366]/80 mt-1">Hassle-free doorstep return pickup and quick refunds or exchanges.</p>
          </div>
        </div>

        {/* Detailed Shipping Policy */}
        <div className="bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xs p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm text-[#3B1366]/90 leading-relaxed font-light">
          <h2 className="font-serif text-2xl font-bold text-[#3B1366]">
            1. Domestic Shipping Policies
          </h2>
          <p>
            All domestic orders are shipped via premier express courier partners including BlueDart, DTDC Air Express, and Delhivery.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Maharashtra & Goa:</strong> 24 to 48 hours delivery from dispatch.</li>
            <li><strong>Metros (Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai):</strong> 2 to 3 business days.</li>
            <li><strong>Rest of India:</strong> 3 to 6 business days.</li>
            <li><strong>Tracking:</strong> Real-time tracking link sent via SMS and WhatsApp as soon as your shipment is dispatched.</li>
          </ul>
        </div>

        {/* Detailed Returns & Exchanges Policy */}
        <div className="bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xs p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm text-[#3B1366]/90 leading-relaxed font-light">
          <h2 className="font-serif text-2xl font-bold text-[#3B1366]">
            2. 7-Day Easy Returns & Exchanges
          </h2>
          <p>
            We take pride in our artisan craftsmanship. If you are not completely satisfied with your saree, we provide an effortless return and exchange service within 7 days of delivery.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>The saree must remain unused, unwashed, and unstitched with original security tags and Silk Mark labels intact.</li>
            <li>To initiate a return, simply contact us via WhatsApp (+91 98220 54321) or email care@anandisarees.com with your order number.</li>
            <li>Our courier partner will arrange a complimentary pickup from your doorstep within 24-48 hours.</li>
            <li>Refunds are initiated within 48 hours of quality inspection back to your original payment method or bank account.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
