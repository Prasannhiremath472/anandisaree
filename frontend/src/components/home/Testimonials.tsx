import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/data/homeContent";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-ds-6 py-20 lg:px-ds-8">
      <div className="mb-12 text-center">
        <span className="font-heading text-ds-xs uppercase tracking-[0.3em] text-gold-600">Customer Love</span>
        <h2 className="mt-ds-4 font-display text-3xl text-gradient-royal sm:text-4xl">What Our Customers Say</h2>
      </div>

      <div className="grid grid-cols-1 gap-ds-7 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl2 border border-gold-200/60 bg-white p-7 shadow-soft"
          >
            <div className="flex gap-1 text-gold-500">
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star key={idx} className="h-4 w-4 fill-gold-500" />
              ))}
            </div>
            <p className="mt-ds-6 text-ds-sm text-charcoal/80">"{t.message}"</p>
            <div className="mt-5">
              <p className="font-heading text-ds-sm font-semibold text-royal-700">{t.name}</p>
              <p className="text-ds-xs text-charcoal/50">{t.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
