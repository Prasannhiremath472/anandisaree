import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HERO_SLIDES } from "@/data/homeContent";
import { useStorefrontBanners } from "@/hooks/useStorefrontBanners";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

interface Slide {
  key: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image: string;
}

export function HeroSlider() {
  const { data: banners, isLoading } = useStorefrontBanners("HOMEPAGE_SLIDER");

  if (isLoading) {
    return <section className="h-[65vh] min-h-[520px] w-full animate-pulse bg-royal-900/10 sm:h-[80vh]" />;
  }

  const slides: Slide[] = banners?.length
    ? banners.map((b) => ({
        key: b.id,
        title: b.title,
        subtitle: b.subtitle ?? undefined,
        ctaLabel: b.ctaLabel ?? undefined,
        ctaHref: b.linkUrl ?? undefined,
        image: b.imageUrl,
      }))
    : HERO_SLIDES.map((s) => ({ ...s, key: s.id }));

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
            <div className="relative h-full w-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-royal-900/80 via-royal-800/50 to-transparent" />

              <div className="relative z-10 flex h-full items-center">
                <div className="mx-auto w-full max-w-7xl px-ds-7 lg:px-ds-8">
                  <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="max-w-xl text-cream-100"
                  >
                    {slide.eyebrow && (
                      <span className="font-heading text-ds-xs uppercase tracking-[0.3em] text-gold-300 sm:text-ds-sm">
                        {slide.eyebrow}
                      </span>
                    )}
                    <h1 className="mt-ds-6 text-balance font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <p className="mt-5 max-w-md text-ds-sm text-cream-200 sm:text-ds-md">{slide.subtitle}</p>
                    )}
                    {slide.ctaLabel && slide.ctaHref && (
                      <Link
                        to={slide.ctaHref}
                        className="mt-ds-8 inline-block rounded-full bg-gold-gradient px-ds-8 py-ds-4 font-heading text-ds-sm font-semibold text-royal-800 shadow-gold transition-transform hover:scale-105"
                      >
                        {slide.ctaLabel}
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
