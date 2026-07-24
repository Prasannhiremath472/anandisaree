import { motion } from "framer-motion";
import { BadgeCheck, PackageCheck, RotateCcw, Truck } from "lucide-react";
import { WHY_CHOOSE_US } from "@/data/homeContent";

const ICONS = [BadgeCheck, PackageCheck, Truck, RotateCcw];

export function WhyChooseUs() {
  return (
    <section className="bg-surface-gradient py-20">
      <div className="mx-auto max-w-7xl px-ds-6 lg:px-ds-8">
        <div className="mb-12 text-center">
          <span className="font-heading text-ds-xs uppercase tracking-[0.3em] text-gold-600">Why Anandi Sarees</span>
          <h2 className="mt-ds-4 font-display text-3xl text-gradient-royal sm:text-4xl">
            Why Choose Authentic Maharashtrian Sarees
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-ds-8 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-xl2 bg-white p-7 text-center shadow-soft transition-shadow hover:shadow-gold"
              >
                <div className="pointer-events-none absolute inset-0 bg-card-sheen opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-royal-gradient text-white shadow-soft">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-5 font-heading text-ds-md font-semibold text-charcoal">{item.title}</h3>
                <p className="relative mt-ds-2 text-ds-sm text-charcoal/70">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
