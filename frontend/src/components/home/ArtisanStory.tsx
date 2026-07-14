import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ARTISAN_STORY_IMAGE } from "@/data/homeContent";

export function ArtisanStory() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[4/5] overflow-hidden rounded-xl2 shadow-soft"
        >
          <img
            src={ARTISAN_STORY_IMAGE}
            alt="Maharashtrian women in traditional sarees"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-heading text-xs uppercase tracking-[0.3em] text-gold-600">Our Craft</span>
          <h2 className="mt-3 text-balance font-display text-3xl text-royal-700 sm:text-4xl">
            Woven by Hand, Rooted in Maharashtra
          </h2>
          <p className="mt-5 text-charcoal/80">
            Every Anandi Saree begins its journey in the weaving clusters of Yeola, Paithan and
            Solapur — where generations of artisans have preserved techniques passed down through
            centuries. Each Paithani takes weeks to complete on a traditional handloom, using pure
            silk and real zari to create motifs like the peacock, lotus and Muniya border that
            define Maharashtrian tradition.
          </p>
          <p className="mt-4 text-charcoal/80">
            We work directly with weaver families, ensuring fair wages and preserving a craft that
            is as much a part of Maharashtra's identity as it is a piece of wearable art.
          </p>
          <Link
            to="/about"
            className="mt-8 inline-block rounded-full bg-royal-600 px-8 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-royal-500"
          >
            Read Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
