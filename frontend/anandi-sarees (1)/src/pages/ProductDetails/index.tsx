import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, 
  ChevronRight, ChevronLeft, Video, Share2
} from 'lucide-react';
import { products } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import { ProductCarousel } from '../../components/products/ProductCarousel';
import { CornerFlourish } from '../../components/decorative/CornerFlourish';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist, setIsVideoCallModalOpen } = useShop();

  const product = useMemo(() => {
    return products.find(p => p.slug === slug) || products[0];
  }, [slug]);

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedBlouse, setSelectedBlouse] = useState<'unstitched' | 'standard' | 'custom'>('unstitched');
  const [activeAccordion, setActiveAccordion] = useState<string | null>('fabric-care');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const isSaved = isInWishlist(product.id);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImgIndex(0);
  }, [slug]);

  // Related products from same category or fabric
  const relatedProducts = useMemo(() => {
    return products
      .filter(p => p.id !== product.id && (p.category === product.category || p.fabric === product.fabric))
      .slice(0, 6);
  }, [product]);

  // Handle Image Zoom Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, product.color, selectedBlouse);
    navigate('/cart?checkout=true');
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-[#FFFFFF] border-b border-[#D4AF37]/30 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-[#3B1366]/70 uppercase tracking-wider overflow-x-auto hide-scrollbar">
            <Link to="/" className="hover:text-[#53208C] hover:underline">Home</Link>
            <span>/</span>
            <Link to="/collections/all" className="hover:text-[#53208C] hover:underline">Sarees</Link>
            <span>/</span>
            <Link to={`/collections/${product.category}`} className="hover:text-[#53208C] hover:underline">
              {product.categoryLabel}
            </Link>
            <span>/</span>
            <span className="text-[#53208C] font-semibold truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* LEFT: Image Gallery with Zoom (7 Cols on Desktop) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Vertical Thumbnail Strip (Desktop) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 hide-scrollbar max-h-[580px]">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xs overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImgIndex === idx 
                      ? 'border-[#53208C] shadow-md scale-102 ring-2 ring-[#D4AF37]/50' 
                      : 'border-[#D4AF37]/30 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View photograph ${idx + 1}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>

            {/* Main High-Res Image Viewport with Zoom */}
            <div className="relative flex-1 aspect-[3/4] max-h-[640px] rounded-xs overflow-hidden border-2 border-[#D4AF37]/40 bg-[#FFFFFF] shadow-lg group">
              {/* Corner flourishes on image frame */}
              <CornerFlourish position="top-left" className="top-2 left-2" size={38} color="#D4AF37" />
              <CornerFlourish position="bottom-right" className="bottom-2 right-2" size={38} color="#D4AF37" />

              <div
                className="w-full h-full cursor-crosshair overflow-hidden"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={product.images[selectedImgIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top transition-transform duration-200"
                  style={{
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                  }}
                />
              </div>

              {/* Badges on Main Image */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
                {product.badge && (
                  <span className="bg-[#53208C] text-[#FAF7F2] text-[10px] font-bold px-2.5 py-1 rounded-xs uppercase tracking-wider shadow-sm border border-[#D4AF37]/40">
                    {product.badge}
                  </span>
                )}
                <span className="bg-[#097969] text-[#FAF7F2] text-[9px] font-semibold px-2 py-0.5 rounded-xs flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  Silk Mark Verified
                </span>
              </div>

              {/* Prev / Next Arrows */}
              {product.images.length > 1 && (
                <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    onClick={() => setSelectedImgIndex(prev => (prev - 1 + product.images.length) % product.images.length)}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#53208C] flex items-center justify-center shadow-md pointer-events-auto transition-transform hover:scale-105 border border-[#D4AF37]/30"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedImgIndex(prev => (prev + 1) % product.images.length)}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#53208C] flex items-center justify-center shadow-md pointer-events-auto transition-transform hover:scale-105 border border-[#D4AF37]/30"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Zoom hint badge */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-xs pointer-events-none">
                Hover to Zoom Fabric
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & Purchase Actions (5 Cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                  {product.categoryLabel} • {product.origin}
                </span>

                {/* Share action */}
                <button
                  type="button"
                  onClick={() => alert(`Link copied for: ${product.name}`)}
                  className="p-1 text-[#3B1366]/60 hover:text-[#53208C] transition-colors"
                  title="Share this saree"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#3B1366] mt-1.5 leading-tight">
                {product.name}
              </h1>

              {/* Star Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex items-center text-[#D4AF37]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-[#D4AF37]/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#53208C]">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-[#3B1366]/70">
                  • {product.reviewCount} Verified Customer Reviews
                </span>
              </div>

              {/* Price & Discount */}
              <div className="flex items-baseline gap-3 mt-4 pb-4 border-b border-[#D4AF37]/30">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#53208C]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-[#3B1366]/60 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="text-xs font-bold text-[#097969] bg-[#097969]/10 px-2.5 py-0.5 rounded-xs border border-[#097969]/20">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Availability & Dispatch Tag */}
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 text-[#097969] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#097969]" />
                  {product.availability}
                </span>
                <span className="text-[#3B1366]/60">•</span>
                <span className="text-[#3B1366]/80">
                  {product.dispatchTime}
                </span>
              </div>

              {/* Short Story */}
              {product.story && (
                <div className="mt-4 p-3.5 bg-[#FFFFFF] border-l-3 border-[#D4AF37] rounded-xs text-xs text-[#3B1366]/90 leading-relaxed italic shadow-2xs">
                  “{product.story}”
                </div>
              )}

              {/* Blouse Stitching Option Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3B1366]">
                    Blouse Stitching Service:
                  </span>
                  <span className="text-[11px] text-[#D4AF37] font-semibold">
                    {selectedBlouse === 'unstitched' ? 'Included Free' : '+ ₹999 Tailoring'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedBlouse('unstitched')}
                    className={`py-2 px-3 rounded-xs border text-center transition-all ${
                      selectedBlouse === 'unstitched'
                        ? 'border-[#53208C] bg-[#53208C] text-[#FAF7F2] font-semibold shadow-xs'
                        : 'border-[#D4AF37]/40 bg-[#FFFFFF] text-[#3B1366] hover:border-[#53208C]'
                    }`}
                  >
                    Unstitched Piece
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBlouse('standard')}
                    className={`py-2 px-3 rounded-xs border text-center transition-all ${
                      selectedBlouse === 'standard'
                        ? 'border-[#53208C] bg-[#53208C] text-[#FAF7F2] font-semibold shadow-xs'
                        : 'border-[#D4AF37]/40 bg-[#FFFFFF] text-[#3B1366] hover:border-[#53208C]'
                    }`}
                  >
                    Standard Stitched
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBlouse('custom')}
                    className={`py-2 px-3 rounded-xs border text-center transition-all ${
                      selectedBlouse === 'custom'
                        ? 'border-[#53208C] bg-[#53208C] text-[#FAF7F2] font-semibold shadow-xs'
                        : 'border-[#D4AF37]/40 bg-[#FFFFFF] text-[#3B1366] hover:border-[#53208C]'
                    }`}
                  >
                    Bespoke Tailoring
                  </button>
                </div>
              </div>

              {/* Saree Key Specs Grid */}
              <div className="grid grid-cols-2 gap-2 mt-5 text-xs">
                <div className="bg-[#FFFFFF] p-2.5 rounded-xs border border-[#D4AF37]/30 shadow-2xs">
                  <span className="text-[#3B1366]/60 block text-[10px] uppercase tracking-wider">Fabric</span>
                  <span className="font-semibold text-[#53208C]">{product.fabric}</span>
                </div>
                <div className="bg-[#FFFFFF] p-2.5 rounded-xs border border-[#D4AF37]/30 shadow-2xs">
                  <span className="text-[#3B1366]/60 block text-[10px] uppercase tracking-wider">Color & Sheen</span>
                  <span className="font-semibold text-[#53208C]">{product.color}</span>
                </div>
                <div className="bg-[#FFFFFF] p-2.5 rounded-xs border border-[#D4AF37]/30 shadow-2xs">
                  <span className="text-[#3B1366]/60 block text-[10px] uppercase tracking-wider">Length</span>
                  <span className="font-semibold text-[#53208C]">{product.length}</span>
                </div>
                <div className="bg-[#FFFFFF] p-2.5 rounded-xs border border-[#D4AF37]/30 shadow-2xs">
                  <span className="text-[#3B1366]/60 block text-[10px] uppercase tracking-wider">Occasion</span>
                  <span className="font-semibold text-[#53208C]">{product.occasion}</span>
                </div>
              </div>
            </div>

            {/* Purchase CTA Buttons */}
            <div className="mt-8 pt-6 border-t border-[#D4AF37]/30 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#D4AF37]/40 rounded-xs bg-[#FFFFFF]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2.5 text-[#3B1366] hover:bg-[#FAF7F2]"
                  >
                    -
                  </button>
                  <span className="px-3.5 font-bold text-xs text-[#53208C]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2.5 text-[#3B1366] hover:bg-[#FAF7F2]"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={() => addToCart(product, quantity, product.color, selectedBlouse)}
                  className="flex-1 bg-[#FFFFFF] hover:bg-[#FAF7F2] text-[#53208C] border-2 border-[#53208C] text-xs font-semibold py-3 px-4 rounded-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag</span>
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xs border transition-colors ${
                    isSaved ? 'bg-[#53208C] text-[#FAF7F2] border-[#53208C]' : 'bg-[#FFFFFF] text-[#53208C] border-[#D4AF37]/40 hover:border-[#53208C]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now Primary CTA */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-[#53208C] via-[#6B2BAF] to-[#53208C] hover:from-[#3B1366] hover:to-[#53208C] text-[#FAF7F2] text-xs font-semibold py-3.5 px-4 rounded-xs uppercase tracking-[0.15em] transition-all shadow-md hover:shadow-lg text-center border border-[#D4AF37]/40"
              >
                Buy Now — Instant Checkout
              </button>

              {/* Video Call Consultation Button */}
              <button
                type="button"
                onClick={() => setIsVideoCallModalOpen(true)}
                className="w-full bg-[#FAF2DE] hover:bg-[#F3E5AB] text-[#53208C] text-xs font-semibold py-2.5 px-4 rounded-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-[#D4AF37]/50"
              >
                <Video className="w-4 h-4 text-[#D4AF37]" />
                <span>Inspect This Saree on Live Video Call</span>
              </button>

              {/* Trust Badges Strip */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#D4AF37]/30 text-[11px] text-[#3B1366]/80 text-center">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-[#097969] mb-0.5" />
                  <span>100% Certified Pure Silk</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-[#53208C] mb-0.5" />
                  <span>Free Insured Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <RefreshCw className="w-4 h-4 text-[#53208C] mb-0.5" />
                  <span>7-Day Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Accordion Section */}
        <div className="mt-16 pt-10 border-t border-[#D4AF37]/30">
          <div className="max-w-4xl mx-auto space-y-3">
            
            {/* Fabric & Care Accordion */}
            <div className="border border-[#D4AF37]/40 rounded-xs bg-[#FFFFFF] overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'fabric-care' ? null : 'fabric-care')}
                className="w-full p-4 flex items-center justify-between text-left font-serif text-lg font-medium text-[#3B1366] hover:bg-[#FAF7F2]/50 transition-colors"
              >
                <span>Fabric, Weaving Technique & Care Instructions</span>
                <ChevronRight className={`w-4 h-4 text-[#D4AF37] transition-transform ${activeAccordion === 'fabric-care' ? 'rotate-90' : ''}`} />
              </button>
              {activeAccordion === 'fabric-care' && (
                <div className="p-4 pt-0 text-xs text-[#3B1366]/90 space-y-2.5 border-t border-[#FAF7F2]">
                  <p><strong>Fabric Composition:</strong> {product.fabric} with authentic gold zari threads.</p>
                  <p><strong>Weaving Cluster:</strong> {product.origin} pit-looms by artisan cooperatives.</p>
                  <p><strong>Blouse Specification:</strong> {product.blouseDetails}</p>
                  <div>
                    <strong>Preservation & Care:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[#3B1366]/80">
                      {product.careInstructions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping & Delivery Accordion */}
            <div className="border border-[#D4AF37]/40 rounded-xs bg-[#FFFFFF] overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')}
                className="w-full p-4 flex items-center justify-between text-left font-serif text-lg font-medium text-[#3B1366] hover:bg-[#FAF7F2]/50 transition-colors"
              >
                <span>Domestic & International Delivery Information</span>
                <ChevronRight className={`w-4 h-4 text-[#D4AF37] transition-transform ${activeAccordion === 'shipping' ? 'rotate-90' : ''}`} />
              </button>
              {activeAccordion === 'shipping' && (
                <div className="p-4 pt-0 text-xs text-[#3B1366]/90 space-y-2 border-t border-[#FAF7F2]">
                  <p>• <strong>Domestic Dispatch:</strong> Dispatched within 24-48 hours via BlueDart Express or DTDC Air.</p>
                  <p>• <strong>Transit Time:</strong> 2-4 days for Maharashtra, Gujarat, Karnataka, Delhi NCR; 4-7 days for other states.</p>
                  <p>• <strong>Packaging:</strong> Delivered in an Anandi gold-embossed keepsake heritage box with protective muslin wrap.</p>
                </div>
              )}
            </div>

            {/* Returns & Exchange Policy Accordion */}
            <div className="border border-[#D4AF37]/40 rounded-xs bg-[#FFFFFF] overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'returns' ? null : 'returns')}
                className="w-full p-4 flex items-center justify-between text-left font-serif text-lg font-medium text-[#3B1366] hover:bg-[#FAF7F2]/50 transition-colors"
              >
                <span>7-Day Return & Authentic Exchange Guarantee</span>
                <ChevronRight className={`w-4 h-4 text-[#D4AF37] transition-transform ${activeAccordion === 'returns' ? 'rotate-90' : ''}`} />
              </button>
              {activeAccordion === 'returns' && (
                <div className="p-4 pt-0 text-xs text-[#3B1366]/90 space-y-2 border-t border-[#FAF7F2]">
                  <p>• We offer an unconditional 7-day exchange or refund for unused sarees in original packaging with intact security tags.</p>
                  <p>• Custom-stitched blouse orders or sarees with custom fall/pico can be exchanged for size adjustments or store credit.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pb-20 sm:pb-0">
            <ProductCarousel
              title="You May Also Cherish"
              subtitle="Complementary Weaves from the Same Artisan Cluster"
              products={relatedProducts}
              viewAllLink={`/collections/${product.category}`}
              bgVariant="ivory"
            />
          </div>
        )}

      </div>

      {/* Mobile Sticky Purchase Bar (Pinned above bottom nav on scroll) */}
      <div className="fixed bottom-14 left-0 right-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#D4AF37]/40 px-3 py-2 sm:hidden flex items-center justify-between gap-2 shadow-2xl">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-10 h-12 object-cover object-top rounded-xs border border-[#D4AF37]/50 shrink-0"
          />
          <div className="min-w-0">
            <div className="text-[11px] font-serif font-bold text-[#3B1366] truncate">{product.name}</div>
            <div className="text-xs font-bold text-[#53208C]">
              ₹{product.price.toLocaleString('en-IN')}
              {product.originalPrice && (
                <span className="text-[10px] text-[#3B1366]/50 line-through font-normal ml-1">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => addToCart(product, quantity, product.color, selectedBlouse)}
            className="px-3 py-2 text-[11px] font-bold rounded-xs uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#3B1366] shadow-sm hover:brightness-105 active:scale-98 transition-all"
          >
            Add to Bag
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="px-3.5 py-2 text-[11px] font-bold rounded-xs uppercase tracking-wider bg-[#53208C] text-[#FAF7F2] shadow-sm border border-[#D4AF37]/50 hover:bg-[#3B1366] active:scale-98 transition-all"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
