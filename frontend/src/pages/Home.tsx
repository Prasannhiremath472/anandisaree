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
import { useStorefrontBanners } from "@/hooks/useStorefrontBanners";

export function Home() {
  const { data: newArrivals = [] } = useStorefrontProducts({ isNewArrival: true, pageSize: 8 });
  const { data: bestSellers = [] } = useStorefrontProducts({ isBestSeller: true, pageSize: 8 });
  const { data: liveSpecials = [] } = useStorefrontProducts({ isLiveSpecial: true, pageSize: 8 });
  const { data: topSelection = [] } = useStorefrontProducts({ isTopSelection: true, pageSize: 8 });
  const { data: collectionBanners } = useStorefrontBanners("COLLECTION_BANNER");
  const { data: festivalBanners } = useStorefrontBanners("FESTIVAL_BANNER");

  const gudiPadwaBanner = collectionBanners?.[0];
  const festiveBanner = festivalBanners?.[0];

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
        title={gudiPadwaBanner?.title ?? GUDI_PADWA_COLLECTION.title}
        subtitle={gudiPadwaBanner?.subtitle ?? GUDI_PADWA_COLLECTION.subtitle}
        image={gudiPadwaBanner?.imageUrl ?? GUDI_PADWA_COLLECTION.image}
        ctaHref={gudiPadwaBanner?.linkUrl ?? GUDI_PADWA_COLLECTION.ctaHref}
        ctaLabel={gudiPadwaBanner?.ctaLabel ?? undefined}
      />

      <ProductRail
        eyebrow="Just In"
        title="New Arrivals"
        products={newArrivals}
        viewAllHref="/new-arrivals"
      />

      {liveSpecials.length > 0 && (
        <ProductRail
          eyebrow="Limited Time"
          title="Live Special Today"
          products={liveSpecials}
          viewAllHref="/live-special-today"
        />
      )}

      {topSelection.length > 0 && (
        <ProductRail
          eyebrow="Handpicked"
          title="Top Selection"
          products={topSelection}
          viewAllHref="/top-selection"
        />
      )}

      <CollectionBanner
        title={festiveBanner?.title ?? FESTIVE_COLLECTION.title}
        subtitle={festiveBanner?.subtitle ?? FESTIVE_COLLECTION.subtitle}
        image={festiveBanner?.imageUrl ?? FESTIVE_COLLECTION.image}
        ctaHref={festiveBanner?.linkUrl ?? FESTIVE_COLLECTION.ctaHref}
        ctaLabel={festiveBanner?.ctaLabel ?? undefined}
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
