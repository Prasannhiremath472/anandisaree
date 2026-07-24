import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HERO_SLIDES } from "@/data/homeContent";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export function HeroSlider() {
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
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
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
                    <span className="font-heading text-ds-xs uppercase tracking-[0.3em] text-gold-300 sm:text-ds-sm">
                      {slide.eyebrow}
                    </span>
                    <h1 className="mt-ds-6 text-balance font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="mt-5 max-w-md text-ds-sm text-cream-200 sm:text-ds-md">{slide.subtitle}</p>
                    <Link
                      to={slide.ctaHref}
                      className="mt-ds-8 inline-block rounded-full bg-gold-gradient px-ds-8 py-ds-4 font-heading text-ds-sm font-semibold text-royal-800 shadow-gold transition-transform hover:scale-105"
                    >
                      {slide.ctaLabel}
                    </Link>
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
