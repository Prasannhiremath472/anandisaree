import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiClient } from "@/api/client";

interface ApiReel {
  id: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  linkUrl: string | null;
}

function useReels() {
  return useQuery({
    queryKey: ["storefront-reels"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: ApiReel[] }>("/storefront/reels");
      return data.data;
    },
  });
}

export function Reels() {
  const { data: reels = [] } = useReels();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-ds-6 lg:px-ds-8">
        <div className="mb-10 text-center">
          <span className="font-heading text-ds-xs uppercase tracking-[0.3em] text-gold-600">Watch &amp; Shop</span>
          <h2 className="mt-ds-4 font-display text-3xl text-gradient-royal sm:text-4xl">Style Reels</h2>
          <p className="mx-auto mt-ds-4 max-w-xl text-ds-sm text-charcoal/70">
            Draping guides, new arrivals and behind-the-scenes from our boutique.
          </p>
        </div>

        {reels.length === 0 ? (
          <p className="text-center text-ds-sm text-charcoal/50">Reels coming soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-ds-6 sm:grid-cols-3 lg:grid-cols-6">
            {reels.map((reel) => {
              const card = (
                <>
                  <img
                    src={reel.thumbnailUrl ?? ""}
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

                  <p className="absolute inset-x-2 bottom-2 line-clamp-2 font-heading text-[11px] font-medium text-white sm:text-ds-xs">
                    {reel.caption}
                  </p>
                </>
              );

              // linkUrl points inside our own site (e.g. a category page); anything
              // else — or no linkUrl at all — opens the reel's own video externally.
              if (reel.linkUrl?.startsWith("/")) {
                return (
                  <Link
                    key={reel.id}
                    to={reel.linkUrl}
                    className="group relative aspect-[9/16] overflow-hidden rounded-xl2 shadow-soft"
                  >
                    {card}
                  </Link>
                );
              }

              return (
                <a
                  key={reel.id}
                  href={reel.linkUrl || reel.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-[9/16] overflow-hidden rounded-xl2 shadow-soft"
                >
                  {card}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
