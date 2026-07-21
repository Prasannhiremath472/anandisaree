import { HeroSlider } from "@/components/home/HeroSlider";
import { Marquee } from "@/components/home/Marquee";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { CollectionBanner } from "@/components/home/CollectionBanner";
import { ProductRail } from "@/components/home/ProductRail";
import { Reels } from "@/components/home/Reels";
import { ArtisanStory } from "@/components/home/ArtisanStory";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { StoreVisit } from "@/components/home/StoreVisit";
import { Newsletter } from "@/components/home/Newsletter";
import { GUDI_PADWA_COLLECTION, FESTIVE_COLLECTION } from "@/data/homeContent";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";

export function Home() {
  const { data: newArrivals = [] } = useStorefrontProducts({ isNewArrival: true, pageSize: 8 });
  const { data: bestSellers = [] } = useStorefrontProducts({ isBestSeller: true, pageSize: 8 });

  return (
    <>
      <HeroSlider />
      <Marquee
        items={[
          "Authentic Handloom Paithani",
          "Pure Zari Craftsmanship",
          "Nauvari Nine-Yard Sarees",
          "Free Shipping Across Maharashtra",
          "Direct From Yeola Weavers",
          "7-Day Easy Returns",
        ]}
      />
      <FeaturedCategories />

      <CollectionBanner
        title={GUDI_PADWA_COLLECTION.title}
        subtitle={GUDI_PADWA_COLLECTION.subtitle}
        image={GUDI_PADWA_COLLECTION.image}
        ctaHref={GUDI_PADWA_COLLECTION.ctaHref}
      />

      <ProductRail
        eyebrow="Just In"
        title="New Arrivals"
        products={newArrivals}
        viewAllHref="/new-arrivals"
      />

      <CollectionBanner
        title={FESTIVE_COLLECTION.title}
        subtitle={FESTIVE_COLLECTION.subtitle}
        image={FESTIVE_COLLECTION.image}
        ctaHref={FESTIVE_COLLECTION.ctaHref}
        reverse
      />

      <ProductRail
        eyebrow="Customer Favorites"
        title="Best Sellers"
        products={bestSellers}
        viewAllHref="/best-sellers"
      />

      <Reels />
      <ArtisanStory />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
      <StoreVisit />
      <Newsletter />
    </>
  );
}
