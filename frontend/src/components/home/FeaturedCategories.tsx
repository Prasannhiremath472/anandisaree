import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { FEATURED_CATEGORIES } from "@/data/homeContent";

import "swiper/css";
import "swiper/css/free-mode";

export function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-12 text-center">
        <span className="font-heading text-xs uppercase tracking-[0.3em] text-gold-600">Shop By Craft</span>
        <h2 className="mt-3 font-display text-3xl text-royal-700 sm:text-4xl">Featured Categories</h2>
      </div>

      <Swiper
        modules={[Autoplay, FreeMode]}
        slidesPerView={2.2}
        spaceBetween={16}
        loop
        freeMode
        autoplay={{ delay: 0, disableOnInteraction: false }}
        speed={4500}
        breakpoints={{
          640: { slidesPerView: 3.2, spaceBetween: 20 },
          1024: { slidesPerView: 6, spaceBetween: 20 },
        }}
        className="!overflow-visible"
      >
        {FEATURED_CATEGORIES.map((cat) => (
          <SwiperSlide key={cat.slug}>
            <Link to={`/category/${cat.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl2 shadow-soft">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-900/70 via-transparent to-transparent" />
              </div>
              <p className="mt-3 text-center font-heading text-sm font-medium text-charcoal group-hover:text-royal-600">
                {cat.name}
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
