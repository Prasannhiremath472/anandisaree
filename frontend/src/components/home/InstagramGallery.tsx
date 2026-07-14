import { Instagram } from "lucide-react";
import { INSTAGRAM_IMAGES } from "@/data/homeContent";

export function InstagramGallery() {
  const loopImages = [...INSTAGRAM_IMAGES, ...INSTAGRAM_IMAGES];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <span className="font-heading text-xs uppercase tracking-[0.3em] text-gold-600">Style Gallery</span>
          <h2 className="mt-3 font-display text-3xl text-royal-700 sm:text-4xl">Follow @anandi_sareelive</h2>
        </div>
      </div>

      <div className="group/marquee overflow-hidden">
        <div className="flex w-max animate-scroll-x gap-3 group-hover/marquee:[animation-play-state:paused]">
          {loopImages.map((src, i) => (
            <a
              key={i}
              href="https://www.instagram.com/anandi_sareelive?igsh="
              target="_blank"
              rel="noreferrer"
              className="group relative h-40 w-40 shrink-0 overflow-hidden rounded-lg sm:h-52 sm:w-52"
            >
              <img
                src={src}
                alt="Customer style"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-royal-900/0 transition-colors group-hover:bg-royal-900/40">
                <Instagram className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
