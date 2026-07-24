import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CollectionBannerProps {
  title: string;
  subtitle: string;
  image: string;
  ctaHref: string;
  ctaLabel?: string;
  reverse?: boolean;
}

export function CollectionBanner({
  title,
  subtitle,
  image,
  ctaHref,
  ctaLabel = "Explore Collection",
  reverse = false,
}: CollectionBannerProps) {
  return (
    <section className="mx-auto max-w-7xl px-ds-6 py-10 lg:px-ds-8">
      <div
        className={cn(
          "grid grid-cols-1 overflow-hidden rounded-xl2 bg-royal-gradient shadow-soft lg:grid-cols-2",
          reverse && "lg:[direction:rtl]"
        )}
      >
        <div className="relative aspect-[4/3] lg:aspect-auto">
          <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: reverse ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center px-ds-8 py-12 text-cream-100 lg:[direction:ltr] lg:px-14"
        >
          <span className="font-heading text-ds-xs uppercase tracking-[0.3em] text-gold-300">Limited Edit</span>
          <h3 className="mt-ds-6 text-balance font-display text-3xl font-semibold sm:text-4xl">{title}</h3>
          <p className="mt-ds-6 max-w-md text-ds-sm text-cream-200 sm:text-ds-md">{subtitle}</p>
          <Link
            to={ctaHref}
            className="mt-ds-8 inline-block w-fit rounded-full border border-gold-300 px-7 py-ds-4 font-heading text-ds-sm font-semibold transition-colors hover:bg-white/10"
          >
            {ctaLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
