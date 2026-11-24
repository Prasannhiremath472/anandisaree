import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, 
  CheckCircle2, Tag, ChevronLeft
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { EthnicBorderStrip } from '../../components/decorative/EthnicBorderStrip';

export const CartPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCheckout = searchParams.get('checkout') === 'true';

  const { cart, removeFromCart, updateQuantity, cartSubtotal, clearCart } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Checkout modal / screen state
  const [isCheckoutStep, setIsCheckoutStep] = useState(initialCheckout);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [checkoutData, setCheckoutData] = useState({
    fullName: 'Radhika Deshpande',
    phone: '+91 98220 12345',
    email: 'radhika@example.com',
    address: 'Flat 402, Shivshahi Residency, Prabhat Road',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411004',
    paymentMethod: 'upi',
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim().toUpperCase() === 'ANANDI10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setCouponDiscount(discount);
      setAppliedCoupon('ANANDI10');
      setCouponInput('');
    } else {
      alert('Invalid coupon code. Try using "ANANDI10" for 10% festive privilege discount.');
    }
  };

  const finalTotal = Math.max(0, cartSubtotal - couponDiscount);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const randomOrder = 'AS-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrder);
    setOrderPlaced(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Placed Success Screen
  if (orderPlaced) {
    return (
      <div className="w-full bg-[#FAF7F2] min-h-screen py-16 select-none">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-[#FFFFFF] border-2 border-[#D4AF37]/50 rounded-xs p-8 sm:p-12 text-center shadow-xl">
            <div className="w-20 h-20 rounded-full bg-[#097969]/10 text-[#097969] flex items-center justify-center mx-auto mb-5 border border-[#097969]/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-1">
              Order Confirmed • Demonstration Mode
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#3B1366]">
              Dhanyavad! Tradition On Its Way
            </h1>

            <p className="text-xs sm:text-sm text-[#3B1366]/80 mt-2.5 max-w-md mx-auto leading-relaxed">
              Your authentic Maharashtrian handloom order has been received. Our weavers and boutique artisans are carefully preparing your drape.
            </p>

            <div className="mt-6 p-4 bg-[#FAF7F2] rounded-xs border border-[#D4AF37]/40 text-xs text-left max-w-md mx-auto space-y-1.5 shadow-2xs">
              <div className="flex justify-between">
                <span className="text-[#3B1366]/70">Demonstration Order ID:</span>
                <strong className="text-[#53208C] font-bold">{orderNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3B1366]/70">Recipient:</span>
                <span className="text-[#3B1366] font-medium">{checkoutData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3B1366]/70">Delivery Destination:</span>
                <span className="text-[#3B1366] font-medium">{checkoutData.city}, {checkoutData.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3B1366]/70">Estimated Delivery:</span>
                <span className="text-[#097969] font-semibold">2-4 Business Days (Express Insured Air)</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="w-full sm:w-auto bg-[#53208C] hover:bg-[#3B1366] text-[#FAF7F2] text-xs font-semibold px-8 py-3 uppercase tracking-wider transition-colors shadow-xs border border-[#D4AF37]/40"
              >
                Back To Homepage
              </Link>
              <Link
                to="/collections/all"
                className="w-full sm:w-auto bg-[#FFFFFF] border border-[#53208C] text-[#53208C] text-xs font-semibold px-8 py-3 uppercase tracking-wider hover:bg-[#FAF7F2] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3B1366] via-[#53208C] to-[#3B1366] text-[#FAF7F2] py-8 sm:py-12 border-b border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-wide">
            {isCheckoutStep ? 'Secure Checkout Demonstration' : 'Your Shopping Bag'}
          </h1>
          <p className="text-xs sm:text-sm text-[#FAF2DE] mt-1 font-light">
            {isCheckoutStep 
              ? 'Complete your simulated delivery details to experience the purchase flow'
              : `${cart.length} Handloom ${cart.length === 1 ? 'Design' : 'Designs'} In Your Wardrobe Bag`}
          </p>
        </div>
      </div>

      <EthnicBorderStrip variant="geometric" color="#D4AF37" className="border-b border-[#D4AF37]/30" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {cart.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xs p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FAF2DE] flex items-center justify-center mx-auto mb-4 text-[#53208C]">
              <ShoppingBag className="w-8 h-8 opacity-70" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-[#3B1366]">
              Your Bag Is Currently Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#3B1366]/80 mt-2 leading-relaxed">
              Discover authentic Yeola Paithani, 9-Yard Nauvari, and festive handloom sarees handwoven by generational artisans.
            </p>
            <Link
              to="/collections/all"
              className="mt-6 inline-flex items-center gap-2 bg-[#53208C] hover:bg-[#3B1366] text-[#FAF7F2] text-xs font-semibold px-6 py-3 uppercase tracking-wider transition-colors shadow-xs border border-[#D4AF37]/40"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Cart Items or Checkout Address Form */}
            <div className="lg:col-span-8 space-y-4">
              
              {!isCheckoutStep ? (
                <>
                  <div className="bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xs p-4 sm:p-6 shadow-2xs">
                    <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30 text-xs text-[#3B1366]/70 uppercase tracking-wider">
                      <span>Product</span>
                      <span>Total</span>
                    </div>

                    <div className="divide-y divide-[#FAF7F2]">
                      {cart.map((item) => (
                        <div key={item.product.id} className="py-4 flex gap-4 items-center">
                          {/* Image */}
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-20 h-24 sm:w-24 sm:h-28 object-cover object-top rounded-xs border border-[#D4AF37]/30"
                          />

                          {/* Info */}
                          <div className="flex-1">
                            <Link
                              to={`/product/${item.product.slug}`}
                              className="font-serif text-base sm:text-lg font-semibold text-[#3B1366] hover:text-[#53208C] line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-[#3B1366]/70 mt-0.5">
                              Fabric: {item.product.fabric} • Color: {item.selectedColor || item.product.color}
                            </p>
                            <p className="text-[11px] text-[#D4AF37] font-semibold mt-0.5">
                              Blouse: {item.blouseStitching === 'unstitched' ? 'Unstitched (Included)' : 'Stitched'}
                            </p>

                            <div className="flex items-center gap-4 mt-3">
                              {/* Quantity */}
                              <div className="flex items-center border border-[#D4AF37]/40 rounded-xs bg-[#FAF7F2]">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1.5 text-[#3B1366] hover:text-[#53208C]"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 text-xs font-bold text-[#53208C]">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1.5 text-[#3B1366] hover:text-[#53208C]"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Remove */}
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-xs text-[#A82828] hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="font-serif text-base sm:text-lg font-bold text-[#53208C]">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Link
                      to="/collections/all"
                      className="text-xs font-semibold text-[#53208C] hover:underline inline-flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Continue Shopping</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setIsCheckoutStep(true)}
                      className="bg-gradient-to-r from-[#53208C] via-[#6B2BAF] to-[#53208C] hover:from-[#3B1366] hover:to-[#53208C] text-[#FAF7F2] text-xs font-semibold px-8 py-3 rounded-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs border border-[#D4AF37]/40"
                    >
                      <span>Proceed To Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                /* Checkout Delivery Information Form */
                <form onSubmit={handlePlaceOrder} className="bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xs p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
                    <h3 className="font-serif text-lg font-bold text-[#3B1366]">
                      1. Delivery Address & Recipient
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsCheckoutStep(false)}
                      className="text-xs text-[#53208C] hover:underline flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Back to Bag</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutData.fullName}
                        onChange={(e) => setCheckoutData({ ...checkoutData, fullName: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                        Mobile Number (for SMS & tracking) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={checkoutData.phone}
                        onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                      Street Address & Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      value={checkoutData.address}
                      onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutData.city}
                        onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutData.state}
                        onChange={(e) => setCheckoutData({ ...checkoutData, state: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3B1366] uppercase tracking-wider mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutData.pincode}
                        onChange={(e) => setCheckoutData({ ...checkoutData, pincode: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none focus:border-[#53208C]"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-4 border-t border-[#D4AF37]/30">
                    <h3 className="font-serif text-lg font-bold text-[#3B1366] mb-3">
                      2. Payment Method (Demonstration)
                    </h3>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 p-3 border border-[#D4AF37]/40 rounded-xs cursor-pointer hover:bg-[#FAF7F2]">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={checkoutData.paymentMethod === 'upi'}
                          onChange={() => setCheckoutData({ ...checkoutData, paymentMethod: 'upi' })}
                          className="accent-[#53208C]"
                        />
                        <span className="font-medium text-[#3B1366]">UPI / QR Code / NetBanking (Instant Confirmation)</span>
                      </label>

                      <label className="flex items-center gap-2 p-3 border border-[#D4AF37]/40 rounded-xs cursor-pointer hover:bg-[#FAF7F2]">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={checkoutData.paymentMethod === 'cod'}
                          onChange={() => setCheckoutData({ ...checkoutData, paymentMethod: 'cod' })}
                          className="accent-[#53208C]"
                        />
                        <span className="font-medium text-[#3B1366]">Cash On Delivery (Available on Domestic Orders)</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#53208C] via-[#6B2BAF] to-[#53208C] hover:from-[#3B1366] hover:to-[#53208C] text-[#FAF7F2] text-xs font-semibold py-4 px-6 rounded-xs uppercase tracking-[0.15em] transition-all shadow-md text-center border border-[#D4AF37]/40"
                    >
                      Place Demonstration Order (₹{finalTotal.toLocaleString('en-IN')})
                    </button>
                    <p className="text-center text-[10px] text-[#3B1366]/60 mt-2">
                      * This is an interactive frontend demonstration. No actual monetary charge will occur.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT COLUMN: Order Summary & Coupon Code */}
            <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xs p-5 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#3B1366] pb-3 border-b border-[#D4AF37]/30">
                Order Summary
              </h3>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (Try: ANANDI10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xs px-3 py-2 text-xs text-[#3B1366] focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  className="bg-[#53208C] text-[#FAF7F2] px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#3B1366] border border-[#D4AF37]/40"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs bg-[#097969]/10 text-[#097969] p-2 rounded-xs font-medium border border-[#097969]/20">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Coupon '{appliedCoupon}' Applied (10% Off)
                  </span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Cost Breakdown */}
              <div className="space-y-2 text-xs pt-2 border-t border-[#D4AF37]/30">
                <div className="flex justify-between text-[#3B1366]">
                  <span>Bag Subtotal</span>
                  <span className="font-medium">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#097969]">
                    <span>Privilege Festive Discount</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#3B1366]">
                  <span>Express Domestic Delivery</span>
                  <span className="text-[#097969] font-medium">FREE</span>
                </div>

                <div className="flex justify-between text-[#3B1366]">
                  <span>Handloom Silk Mark Authenticity</span>
                  <span className="text-[#097969] font-medium">Certified Included</span>
                </div>

                <div className="flex justify-between text-base font-serif font-bold text-[#53208C] pt-3 border-t border-[#D4AF37]/30">
                  <span>Grand Total</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {!isCheckoutStep && (
                <button
                  type="button"
                  onClick={() => setIsCheckoutStep(true)}
                  className="w-full bg-gradient-to-r from-[#53208C] via-[#6B2BAF] to-[#53208C] hover:from-[#3B1366] hover:to-[#53208C] text-[#FAF7F2] text-xs font-semibold py-3.5 px-4 rounded-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs border border-[#D4AF37]/40"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Security note */}
              <div className="pt-2 text-[10px] text-[#3B1366]/70 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#097969]" />
                <span>256-Bit SSL Encrypted & Verified Heritage Guarantee</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
