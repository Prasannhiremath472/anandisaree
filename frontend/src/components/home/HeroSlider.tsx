import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { HERO_SLIDES } from "@/data/homeContent";
import { useStorefrontBanners } from "@/hooks/useStorefrontBanners";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

interface Slide {
  key: string;
  title: string;
  image: string;
  mobileImage?: string;
}

// Hero banners are wide letterbox images (1600×466, ~3.43:1) rather than a
// tall viewport-filling photo, so the slider's height tracks the image's own
// aspect ratio via aspect-ratio instead of a fixed vh crop — the full image
// is always visible, nothing is cropped off the top/bottom on any screen.
const HERO_ASPECT_RATIO = "1600 / 466";

export function HeroSlider() {
  const { data: banners, isLoading } = useStorefrontBanners("HOMEPAGE_SLIDER");

  if (isLoading) {
    return <section className="w-full animate-pulse bg-royal-900/10" style={{ aspectRatio: HERO_ASPECT_RATIO }} />;
  }

  const slides: Slide[] = banners?.length
    ? banners.map((b) => ({ key: b.id, title: b.title, image: b.imageUrl, mobileImage: b.mobileImageUrl ?? undefined }))
    : HERO_SLIDES.map((s) => ({ key: s.id, title: s.title, image: s.image }));

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="hero-swiper w-full"
        style={{ aspectRatio: HERO_ASPECT_RATIO }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.key}>
            <picture>
              {slide.mobileImage && <source media="(max-width: 639px)" srcSet={slide.mobileImage} />}
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
