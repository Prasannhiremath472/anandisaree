import { HeroSlider } from "@/components/home/HeroSlider";
import { Marquee } from "@/components/home/Marquee";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { CollectionBanner } from "@/components/home/CollectionBanner";
import { ProductRail } from "@/components/home/ProductRail";
import { ArtisanStory } from "@/components/home/ArtisanStory";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { StoreVisit } from "@/components/home/StoreVisit";
import { Newsletter } from "@/components/home/Newsletter";
import { GUDI_PADWA_COLLECTION, FESTIVE_COLLECTION, NEW_ARRIVALS, BEST_SELLERS } from "@/data/homeContent";

export function Home() {
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
        products={NEW_ARRIVALS}
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
        products={BEST_SELLERS}
        viewAllHref="/best-sellers"
      />

      <ArtisanStory />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
      <StoreVisit />
      <Newsletter />
    </>
  );
}
