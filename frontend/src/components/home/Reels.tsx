import { Play } from "lucide-react";
import { INSTAGRAM_IMAGES } from "@/data/homeContent";

interface ReelSlot {
  id: string;
  thumbnail: string;
  caption: string;
  videoUrl?: string;
}

const DEMO_REELS: ReelSlot[] = INSTAGRAM_IMAGES.slice(0, 6).map((thumbnail, i) => ({
  id: `reel-${i + 1}`,
  thumbnail,
  caption: ["Paithani Drape Styling", "New Collection Launch", "Behind The Loom", "Customer Favorite Look", "Festive Edit", "Nauvari Draping Guide"][i],
}));

export function Reels() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <span className="font-heading text-xs uppercase tracking-[0.3em] text-gold-600">Watch &amp; Shop</span>
          <h2 className="mt-3 font-display text-3xl text-gradient-royal sm:text-4xl">Style Reels</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal/70">
            Draping guides, new arrivals and behind-the-scenes from our boutique — reels added soon.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {DEMO_REELS.map((reel) => (
            <a
              key={reel.id}
              href="https://www.instagram.com/anandi_sareelive?igsh="
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-[9/16] overflow-hidden rounded-xl2 shadow-soft"
            >
              <img
                src={reel.thumbnail}
                alt={reel.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-900/85 via-royal-900/10 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-5 w-5 fill-white text-white" />
                </div>
              </div>

              <p className="absolute inset-x-2 bottom-2 line-clamp-2 font-heading text-[11px] font-medium text-white sm:text-xs">
                {reel.caption}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
