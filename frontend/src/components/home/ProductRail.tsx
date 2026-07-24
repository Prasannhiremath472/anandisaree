import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { ProductCard } from "./ProductCard";
import type { ProductCard as ProductCardData } from "@/data/homeContent";

import "swiper/css";
import "swiper/css/navigation";

interface ProductRailProps {
  eyebrow: string;
  title: string;
  products: ProductCardData[];
  viewAllHref: string;
}

export function ProductRail({ eyebrow, title, products, viewAllHref }: ProductRailProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-ds-6 py-16 lg:px-ds-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="font-heading text-ds-xs uppercase tracking-[0.3em] text-gold-600">{eyebrow}</span>
          <h2 className="mt-ds-4 font-display text-3xl text-gradient-royal sm:text-4xl">{title}</h2>
        </div>

        <div className="hidden items-center gap-ds-4 sm:flex">
          <Link
            to={viewAllHref}
            className="flex items-center gap-1 font-heading text-ds-sm font-medium text-royal-600 hover:text-royal-500"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="ml-ds-6 flex gap-ds-2">
            <button
              aria-label="Previous"
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-royal-200 text-royal-600 transition-colors hover:bg-royal-600 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Next"
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-royal-200 text-royal-600 transition-colors hover:bg-royal-600 hover:text-white"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <Swiper
          modules={[Navigation]}
          onSwiper={(s) => (swiperRef.current = s)}
          slidesPerView={2}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-ds-8 text-center sm:hidden">
        <Link to={viewAllHref} className="font-heading text-ds-sm font-medium text-royal-600">
          View All →
        </Link>
      </div>
    </section>
  );
}
