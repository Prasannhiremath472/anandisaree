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

export function HeroSlider() {
  const { data: banners, isLoading } = useStorefrontBanners("HOMEPAGE_SLIDER");

  if (isLoading) {
    return <section className="h-[65vh] min-h-[520px] w-full animate-pulse bg-royal-900/10 sm:h-[80vh]" />;
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
        className="hero-swiper h-[65vh] min-h-[520px] w-full sm:h-[80vh]"
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
