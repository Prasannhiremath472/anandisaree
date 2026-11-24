import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../../components/products/ProductCard';
import { EthnicBorderStrip } from '../../components/decorative/EthnicBorderStrip';

export const WishlistPage: React.FC = () => {
  const { getWishlistProducts } = useShop();
  const savedProducts = getWishlistProducts();

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3B1366] via-[#53208C] to-[#3B1366] text-[#FAF7F2] py-10 sm:py-14 text-center border-b border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-12 h-12 rounded-full bg-[#3B1366] border border-[#D4AF37] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Heart className="w-6 h-6 text-[#D4AF37] fill-current" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-wide">
            Your Saved Heritage Drapes
          </h1>
          <p className="text-xs sm:text-sm text-[#FAF2DE] mt-1.5 font-light">
            {savedProducts.length} Heirloom {savedProducts.length === 1 ? 'Saree' : 'Sarees'} Curated In Your Personal Wishlist
          </p>
        </div>
      </div>

      <EthnicBorderStrip variant="geometric" color="#D4AF37" className="border-b border-[#D4AF37]/30" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {savedProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xs p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FAF2DE] flex items-center justify-center mx-auto mb-4 text-[#53208C]">
              <Heart className="w-8 h-8 opacity-70" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-[#3B1366]">
              Your Wishlist Is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#3B1366]/80 mt-2 leading-relaxed">
              Explore our pure silk Paithani, Nauvari, and festive handloom collections to save your favorite sarees.
            </p>
            <Link
              to="/collections/all"
              className="mt-6 inline-flex items-center gap-2 bg-[#53208C] hover:bg-[#3B1366] text-[#FAF7F2] text-xs font-semibold px-6 py-3 uppercase tracking-wider transition-colors shadow-xs border border-[#D4AF37]/40"
            >
              <span>Explore All Sarees</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {savedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/collections/all"
                className="inline-block bg-transparent hover:bg-[#FAF2DE]/50 text-[#53208C] border border-[#53208C] text-xs font-semibold px-8 py-3 uppercase tracking-wider transition-colors shadow-2xs"
              >
                Continue Exploring Collections
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
