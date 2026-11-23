import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { products } from '../../data/products';
import { ProductCard } from '../../components/products/ProductCard';
import { EthnicBorderStrip } from '../../components/decorative/EthnicBorderStrip';

interface FilterOptions {
  priceMax: number;
  fabrics: string[];
  colors: string[];
  occasions: string[];
  sareeTypes: string[];
  availability: string[];
  sortBy: string;
}

export const CollectionsPage: React.FC = () => {
  const { category = 'all' } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('q') || '';

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    priceMax: 25000,
    fabrics: [],
    colors: [],
    occasions: [],
    sareeTypes: [],
    availability: [],
    sortBy: 'featured',
  });

  // Reset category filters when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category, searchQ]);

  // Available unique filter values
  const availableFabrics = useMemo(() => Array.from(new Set(products.map(p => p.fabric))), []);
  const availableColors = useMemo(() => Array.from(new Set(products.map(p => p.color))), []);
  const availableOccasions = useMemo(() => Array.from(new Set(products.map(p => p.occasion))), []);

  // Category Metadata Header
  const categoryMeta = useMemo(() => {
    switch (category) {
      case 'paithani':
        return {
          title: 'Pure Silk Paithani Sarees',
          subtitle: 'The Queen of Maharashtrian Handlooms',
          desc: 'Woven on wooden pit-looms in Yeola and Paithan with authentic gold zari Mor-Bangadi peacock and parrot motifs.',
          bannerBg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80',
        };
      case 'nauvari':
        return {
          title: 'Traditional 9-Yard Nauvari Sarees',
          subtitle: 'The Royal Kashta Drape of Maharashtrian Royalty',
          desc: 'Authentic 9-yard silk and shalu sarees crafted with traditional kathi borders for auspicious bridal and ritual drapes.',
          bannerBg: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1400&q=80',
        };
      case 'narayan-peth':
        return {
          title: 'Narayan Peth Temple Border Sarees',
          subtitle: 'Centuries-Old Double Shaded Heritage',
          desc: 'Celebrated for shimmering rudraksha borders in gold zari and contrasting vibrant silk-cotton bodies.',
          bannerBg: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1400&q=80',
        };
      case 'solapuri-cotton':
        return {
          title: 'Solapuri Handloom Cotton Sarees',
          subtitle: 'Breathable Artisanal Handspun Elegance',
          desc: 'Combed pure cotton woven by Solapur weaver guilds with geometric temple motifs and lightweight daylong comfort.',
          bannerBg: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=80',
        };
      case 'handloom':
        return {
          title: 'Certified Handloom Weaves',
          subtitle: 'From Master Looms Directly to Your Wardrobe',
          desc: 'Artisanal pit-loom sarees honoring centuries of slow fashion, natural dyes, and pure Silk Mark integrity.',
          bannerBg: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=80',
        };
      case 'wedding':
        return {
          title: 'Maharashtrian Bridal Shalu Collection',
          subtitle: 'Regal Weaves For Your Auspicious Lagna',
          desc: 'Heavy pure silk katan, Yeola Paithani, and zari gharchola sarees woven to turn wedding moments into eternal memories.',
          bannerBg: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1400&q=80',
        };
      case 'festive':
        return {
          title: 'Festive & Gudi Padwa Edit',
          subtitle: 'Celebratory Hues in Pure Silk & Zari',
          desc: 'Luminous sarees for Gudi Padwa, Diwali Laxmi Pujan, Sakhar Puda, and family celebrations.',
          bannerBg: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1400&q=80',
        };
      case 'under-999':
        return {
          title: 'Festive Sarees Under ₹999',
          subtitle: 'Exceptional Handcrafted Value',
          desc: 'Pure cotton silk and Chanderi sarees with zari borders at factory-direct pricing under ₹999.',
          bannerBg: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=80',
        };
      case 'best-sellers':
        return {
          title: 'Timeless Best Sellers',
          subtitle: 'The Most Celebrated Drapes of Anandi Sarees',
          desc: 'Our highest rated, customer-adored weaves across Paithani, Nauvari, and handloom silk.',
          bannerBg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80',
        };
      case 'new-arrivals':
        return {
          title: 'New Loom Arrivals',
          subtitle: 'Fresh Off The Weaving Frames',
          desc: 'The latest seasonal colorways, contemporary zari patterns, and fresh weaver creations.',
          bannerBg: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=80',
        };
      default:
        return {
          title: searchQ ? `Search Results: "${searchQ}"` : 'All Handloom Sarees',
          subtitle: 'The Complete Anandi Sarees Catalog',
          desc: 'Explore the full spectrum of authentic Maharashtrian handlooms, bridal shalus, and artisanal drapes.',
          bannerBg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80',
        };
    }
  }, [category, searchQ]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category route filter
    if (category !== 'all') {
      if (category === 'under-999') {
        result = result.filter(p => p.price <= 999);
      } else if (category === 'best-sellers') {
        result = result.filter(p => p.bestseller || p.badge === 'BEST SELLER');
      } else if (category === 'new-arrivals') {
        result = result.filter(p => p.badge === 'NEW');
      } else if (category === 'wedding') {
        result = result.filter(p => p.occasion === 'Wedding');
      } else if (category === 'festive') {
        result = result.filter(p => p.occasion === 'Festive' || p.occasion === 'Diwali' || p.occasion === 'Gudi Padwa');
      } else {
        result = result.filter(p => p.category === category);
      }
    }

    // Custom Filters
    if (filters.fabrics.length > 0) {
      result = result.filter(p => filters.fabrics.includes(p.fabric));
    }

    if (filters.colors.length > 0) {
      result = result.filter(p => filters.colors.includes(p.color));
    }

    if (filters.occasions.length > 0) {
      result = result.filter(p => filters.occasions.includes(p.occasion));
    }

    if (filters.priceMax < 25000) {
      result = result.filter(p => p.price <= filters.priceMax);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low-to-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-to-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case 'newest':
        result.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [category, searchQ, filters]);

  const toggleFabricFilter = (fabric: string) => {
    setFilters(prev => ({
      ...prev,
      fabrics: prev.fabrics.includes(fabric)
        ? prev.fabrics.filter(f => f !== fabric)
        : [...prev.fabrics, fabric]
    }));
  };

  const toggleColorFilter = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const toggleOccasionFilter = (occ: string) => {
    setFilters(prev => ({
      ...prev,
      occasions: prev.occasions.includes(occ)
        ? prev.occasions.filter(o => o !== occ)
        : [...prev.occasions, occ]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      priceMax: 25000,
      fabrics: [],
      colors: [],
      occasions: [],
      sareeTypes: [],
      availability: [],
      sortBy: 'featured',
    });
  };

  const activeFilterCount = 
    filters.fabrics.length + 
    filters.colors.length + 
    filters.occasions.length + 
    (filters.priceMax < 25000 ? 1 : 0);

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Collection Hero Banner with Royal Purple & Gold Framing */}
      <div className="relative w-full overflow-hidden bg-royal-purple text-[#FAF7F2] py-12 md:py-16 border-b-2 border-[#D4AF37]">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${categoryMeta.bannerBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A0B4C] via-[#53208C]/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] mb-3 uppercase tracking-wider">
              <Link to="/" className="hover:underline">Home</Link>
              <span>/</span>
              <Link to="/collections/all" className="hover:underline">Collections</Link>
              <span>/</span>
              <span className="text-[#FFFFFF] font-semibold">{categoryMeta.title}</span>
            </div>

            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-1">
              {categoryMeta.subtitle}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#FFFFFF] drop-shadow-sm">
              {categoryMeta.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#F4EFE6]/90 mt-3 leading-relaxed font-light">
              {categoryMeta.desc}
            </p>
          </div>
        </div>
      </div>

      <EthnicBorderStrip variant="geometric" color="#53208C" className="border-b border-[#D4AF37]/40" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Top Control Bar: Product Count, Mobile Filter Trigger, Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#D4AF37]/30 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#5E4675] font-semibold">
              Showing <strong className="text-[#53208C]">{filteredProducts.length}</strong> Royal Handcrafted Sarees
            </span>

            {/* Mobile Filter Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden ml-auto inline-flex items-center gap-1.5 bg-[#FFFFFF] border-2 border-[#53208C] text-[#53208C] text-xs font-bold px-3.5 py-1.5 rounded-xs"
            >
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Filters ({activeFilterCount})</span>
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#5E4675] uppercase tracking-wider font-semibold">Sort By:</span>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="bg-[#FFFFFF] border border-[#E8DDF0] rounded-xs px-3 py-1.5 text-xs text-[#53208C] font-semibold focus:outline-none focus:border-[#53208C] pr-7 appearance-none cursor-pointer"
              >
                <option value="featured">Featured / Curated</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Highest Discount</option>
                <option value="newest">New Arrivals First</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#53208C] absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Layout: Filters Sidebar (Desktop) + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar in Royal Purple & Gold */}
          <aside className="hidden lg:block lg:col-span-3 bg-[#FFFFFF] border border-[#E8DDF0] rounded-xs p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDF0]">
              <h3 className="font-serif text-lg font-bold text-[#53208C] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                Filter Sarees
              </h3>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[11px] text-[#53208C] font-bold hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Price Max Slider */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#53208C] mb-2">
                Max Price: ₹{filters.priceMax.toLocaleString('en-IN')}
              </h4>
              <input
                type="range"
                min="900"
                max="25000"
                step="500"
                value={filters.priceMax}
                onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                className="w-full accent-[#53208C]"
              />
              <div className="flex justify-between text-[10px] text-[#5E4675] mt-1 font-medium">
                <span>₹900</span>
                <span>₹25,000</span>
              </div>
            </div>

            {/* Fabric Filter */}
            <div className="pt-4 border-t border-[#E8DDF0]">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#53208C] mb-2.5">
                Fabric
              </h4>
              <div className="space-y-1.5 text-xs">
                {availableFabrics.map((fabric) => (
                  <label key={fabric} className="flex items-center gap-2 text-[#3B1366] hover:text-[#53208C] cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={filters.fabrics.includes(fabric)}
                      onChange={() => toggleFabricFilter(fabric)}
                      className="accent-[#53208C] rounded-xs"
                    />
                    <span>{fabric}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="pt-4 border-t border-[#E8DDF0]">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#53208C] mb-2.5">
                Color
              </h4>
              <div className="space-y-1.5 text-xs">
                {availableColors.map((color) => (
                  <label key={color} className="flex items-center gap-2 text-[#3B1366] hover:text-[#53208C] cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes(color)}
                      onChange={() => toggleColorFilter(color)}
                      className="accent-[#53208C] rounded-xs"
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Occasion Filter */}
            <div className="pt-4 border-t border-[#E8DDF0]">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#53208C] mb-2.5">
                Occasion
              </h4>
              <div className="space-y-1.5 text-xs">
                {availableOccasions.map((occ) => (
                  <label key={occ} className="flex items-center gap-2 text-[#3B1366] hover:text-[#53208C] cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={filters.occasions.includes(occ)}
                      onChange={() => toggleOccasionFilter(occ)}
                      className="accent-[#53208C] rounded-xs"
                    />
                    <span>{occ}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area: 4 Cols on Desktop, 3 on Tablet, 2 on Mobile */}
          <main className="col-span-1 lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-[#FFFFFF] border-2 border-[#D4AF37]/50 rounded-xs p-8">
                <h3 className="font-serif text-2xl text-[#53208C] font-medium">
                  No Sarees Found Matching Criteria
                </h3>
                <p className="text-xs sm:text-sm text-[#5E4675] mt-2 max-w-md mx-auto font-light">
                  Try clearing some filter criteria or exploring our curated royal Paithani and handloom collections.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-6 bg-[#53208C] text-[#FAF7F2] text-xs font-bold px-6 py-2.5 uppercase tracking-wider hover:bg-[#3B1366] transition-colors border border-[#D4AF37]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#FFFFFF] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 bg-[#53208C] text-[#FAF7F2] flex items-center justify-between border-b border-[#D4AF37]">
              <h3 className="font-serif text-base font-semibold">Filter Sarees</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-[#D4AF37]" />
              </button>
            </div>

            <div className="p-5 space-y-6 flex-1 overflow-y-auto text-xs">
              {/* Price */}
              <div>
                <h4 className="font-bold text-[#53208C] uppercase tracking-wider mb-2">
                  Max Price: ₹{filters.priceMax.toLocaleString('en-IN')}
                </h4>
                <input
                  type="range"
                  min="900"
                  max="25000"
                  step="500"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                  className="w-full accent-[#53208C]"
                />
              </div>

              {/* Fabrics */}
              <div className="pt-4 border-t border-[#E8DDF0]">
                <h4 className="font-bold text-[#53208C] uppercase tracking-wider mb-2">Fabrics</h4>
                <div className="space-y-2">
                  {availableFabrics.map((f) => (
                    <label key={f} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.fabrics.includes(f)}
                        onChange={() => toggleFabricFilter(f)}
                        className="accent-[#53208C]"
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="pt-4 border-t border-[#E8DDF0]">
                <h4 className="font-bold text-[#53208C] uppercase tracking-wider mb-2">Colors</h4>
                <div className="space-y-2">
                  {availableColors.map((c) => (
                    <label key={c} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.colors.includes(c)}
                        onChange={() => toggleColorFilter(c)}
                        className="accent-[#53208C]"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E8DDF0] grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="bg-[#FAF7F2] border border-[#53208C] text-[#53208C] text-xs font-bold py-2.5 uppercase"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="bg-[#53208C] text-[#FAF7F2] text-xs font-bold py-2.5 uppercase border border-[#D4AF37]"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
