import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal,
    totalCartCount 
  } = useShop();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2500;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#2A0B4C] shadow-2xl flex flex-col border-l border-[#D4AF37]/50">
          
          {/* Drawer Header in Royal Purple & Gold */}
          <div className="p-4 sm:p-5 border-b border-[#D4AF37]/40 flex items-center justify-between bg-[#53208C] text-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif text-lg font-medium tracking-wider">
                Shopping Bag ({totalCartCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-[#D4AF37] hover:text-[#FFFFFF] transition-colors focus:outline-none"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping / Heritage Gift Progress Bar */}
          <div className="p-3.5 bg-[#F5EEFA] border-b border-[#E8DDF0] text-xs">
            {cartSubtotal >= freeShippingThreshold ? (
              <p className="text-[#53208C] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>You qualify for complimentary domestic express delivery!</span>
              </p>
            ) : (
              <div>
                <p className="text-[#3B1366] mb-1.5">
                  Add <span className="font-bold text-[#53208C]">₹{(freeShippingThreshold - cartSubtotal).toLocaleString('en-IN')}</span> more for complimentary express air shipping!
                </p>
                <div className="w-full bg-[#E8DDF0] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#53208C] h-full transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F5EEFA] border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4 text-[#53208C]">
                  <ShoppingBag className="w-8 h-8 opacity-70 text-[#D4AF37]" />
                </div>
                <h4 className="font-serif text-xl font-medium text-[#53208C]">
                  Your bag is empty
                </h4>
                <p className="text-xs text-[#5E4675] mt-1 max-w-xs mx-auto">
                  Explore our handcrafted Paithani, Nauvari, and handloom silk collections.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/collections/all');
                  }}
                  className="mt-6 inline-block bg-[#53208C] hover:bg-[#3B1366] text-[#FAF7F2] text-xs font-bold px-6 py-2.5 uppercase tracking-wider transition-colors shadow-md border border-[#D4AF37]"
                >
                  Explore Sarees
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-3 sm:gap-4 p-3 bg-[#FFFFFF] border border-[#E8DDF0] rounded-xs shadow-xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover object-top rounded-xs border border-[#E8DDF0]"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-sm font-semibold text-[#53208C] hover:text-[#D4AF37] line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#5E4675]/50 hover:text-[#801818] p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#5E4675] mt-0.5">
                        Fabric: {item.product.fabric} • Color: {item.selectedColor || item.product.color}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5EEFA]">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#E8DDF0] rounded-xs bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:text-[#53208C] text-[#5E4675]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#53208C]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:text-[#53208C] text-[#5E4675]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#53208C]">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E8DDF0] bg-[#FFFFFF] shadow-lg">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-[#5E4675]">Estimated Subtotal</span>
                <span className="font-serif text-lg font-bold text-[#53208C]">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-[#5E4675]/80 mb-4">
                Taxes included. Handloom authenticity certificate included with order.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-[#FAF7F2] hover:bg-[#F5EEFA] text-[#53208C] border border-[#53208C] text-xs font-bold py-2.5 px-3 text-center uppercase tracking-wider transition-colors"
                >
                  View Bag
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart?checkout=true');
                  }}
                  className="w-full bg-[#53208C] hover:bg-[#3B1366] text-[#FAF7F2] text-xs font-bold py-2.5 px-3 flex items-center justify-center gap-1 uppercase tracking-wider transition-colors shadow-md border border-[#D4AF37]"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
