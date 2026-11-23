import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/navigation/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/products/QuickViewModal';
import { VideoCallModal } from './components/common/VideoCallModal';

// Pages
import { HomePage } from './pages/Home';
import { CollectionsPage } from './pages/Collections';
import { ProductDetailsPage } from './pages/ProductDetails';
import { WishlistPage } from './pages/Wishlist';
import { CartPage } from './pages/Cart';
import { AboutPage } from './pages/About';
import { ContactPage } from './pages/Contact';
import { FAQPage } from './pages/FAQ';
import { ShippingAndReturnsPage } from './pages/ShippingAndReturns';

// ScrollToTop Helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#3B1366] font-sans antialiased overflow-x-hidden">
          {/* Global Header */}
          <Header />

          {/* Main Viewport */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:category" element={<CollectionsPage />} />
              <Route path="/product/:slug" element={<ProductDetailsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/shipping-and-returns" element={<ShippingAndReturnsPage />} />
              {/* Fallback to Home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Global Modals & Drawers */}
          <CartDrawer />
          <QuickViewModal />
          <VideoCallModal />
        </div>
      </Router>
    </ShopProvider>
  );
};

export default App;
