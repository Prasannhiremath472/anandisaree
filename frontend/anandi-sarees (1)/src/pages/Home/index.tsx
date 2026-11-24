import React, { useMemo } from 'react';
import { HeroCampaign } from '../../components/banners/HeroCampaign';
import { ShopByCategory } from '../../components/collections/ShopByCategory';
import { ProductCarousel } from '../../components/products/ProductCarousel';
import { CustomHeritageCampaign } from '../../components/banners/CustomHeritageCampaign';
import { HouseOfAnandi } from '../../components/banners/HouseOfAnandi';
import { ShopByOccasion } from '../../components/collections/ShopByOccasion';
import { TheAnandiEdit } from '../../components/collections/TheAnandiEdit';
import { ServiceTrustBanner } from '../../components/banners/ServiceTrustBanner';
import { VideoCallBanner } from '../../components/banners/VideoCallBanner';
import { ShopByCraft } from '../../components/collections/ShopByCraft';
import { FeaturedCollectionBanners } from '../../components/banners/FeaturedCollectionBanners';
import { WatchAndShop } from '../../components/banners/WatchAndShop';
import { WhyChooseAnandi } from '../../components/banners/WhyChooseAnandi';
import { CustomerTestimonials } from '../../components/banners/CustomerTestimonials';
import { InstagramGallery } from '../../components/banners/InstagramGallery';
import { products } from '../../data/products';

export const HomePage: React.FC = () => {
  // Section 03: 6 New Arrivals
  const newArrivals = useMemo(() => {
    return products.filter(p => p.badge === 'NEW' || p.featured).slice(0, 6);
  }, []);

  // Section 05: 6 Best Sellers
  const bestSellers = useMemo(() => {
    return products.filter(p => p.bestseller || p.badge === 'BEST SELLER').slice(0, 6);
  }, []);

  // Section 11: 6 Handpicked Sarees
  const handpickedSarees = useMemo(() => {
    return products.slice(6, 12);
  }, []);

  return (
    <div className="w-full flex flex-col">
      {/* 01. Hero campaign */}
      <HeroCampaign />

      {/* 02. Shop by Category */}
      <ShopByCategory />

      {/* 03. New Arrivals Carousel (6 products) */}
      <ProductCarousel
        title="New Arrivals"
        subtitle="Fresh Off The Loom • Handcrafted Silk & Zari"
        products={newArrivals}
        viewAllLink="/collections/new-arrivals"
        bgVariant="ivory"
      />

      {/* 04. Custom Heritage Campaign */}
      <CustomHeritageCampaign />

      {/* 05. Best Sellers Carousel (6 products with deeper beige background) */}
      <ProductCarousel
        title="Best Sellers"
        subtitle="Timeless Customer Favorites • Royal Maharashtrian Weaves"
        products={bestSellers}
        viewAllLink="/collections/best-sellers"
        bgVariant="warm-beige"
      />

      {/* 06. The House of Anandi (Split screen + 6-photo gallery) */}
      <HouseOfAnandi />

      {/* 07. Shop by Occasion */}
      <ShopByOccasion />

      {/* 08. The Anandi Edit */}
      <TheAnandiEdit />

      {/* 09. Service and trust banner */}
      <ServiceTrustBanner />

      {/* 10. Shop via Video Call */}
      <VideoCallBanner />

      {/* 11. Handpicked Sarees */}
      <ProductCarousel
        title="Handpicked Sarees"
        subtitle="Curated By Our Master Drapers For Effortless Elegance"
        products={handpickedSarees}
        viewAllLink="/collections/handloom"
        bgVariant="white"
      />

      {/* 12. Shop by Craft */}
      <ShopByCraft />

      {/* 13. Featured collection banners (Timeless Best Sellers & Exclusive Anandi Collection) */}
      <FeaturedCollectionBanners />

      {/* 14. Watch & Shop */}
      <WatchAndShop />

      {/* 15. Why Choose Anandi Sarees */}
      <WhyChooseAnandi />

      {/* 16. Customer Testimonials */}
      <CustomerTestimonials />

      {/* 17. Instagram gallery */}
      <InstagramGallery />
    </div>
  );
};
