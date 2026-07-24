import { MapPin, MessageCircle, Phone } from "lucide-react";
import { BUSINESS } from "@/data/business";

export function StoreVisit() {
  return (
    <section className="mx-auto max-w-7xl px-ds-6 py-20 lg:px-ds-8">
      <div className="grid grid-cols-1 overflow-hidden rounded-xl2 shadow-soft lg:grid-cols-2">
        <div className="bg-royal-600 p-10 text-cream-100 lg:p-14">
          <span className="font-heading text-ds-xs uppercase tracking-[0.3em] text-gold-300">Visit Us</span>
          <h2 className="mt-ds-6 font-display text-3xl">Experience Our Sarees In Person</h2>
          <p className="mt-ds-6 text-ds-sm text-cream-200">
            Drop by our boutique to feel the fabric, see the zari work up close, and get styled by
            our in-store experts.
          </p>

          <div className="mt-ds-8 space-y-ds-6 text-ds-sm">
            <div className="flex items-start gap-ds-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
              <span>{BUSINESS.address}</span>
            </div>
            <div className="flex items-center gap-ds-4">
              <Phone className="h-5 w-5 shrink-0 text-gold-300" />
              <span>{BUSINESS.phone}</span>
            </div>
          </div>

          <a
            href={`https://wa.me/${BUSINESS.phoneRaw}`}
            target="_blank"
            rel="noreferrer"
            className="mt-ds-8 inline-flex items-center gap-ds-2 rounded-full bg-[#25D366] px-7 py-ds-4 font-heading text-ds-sm font-semibold text-white transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>

        <div className="min-h-[320px] w-full">
          <iframe
            title="Anandi Sarees Store Location"
            src="https://www.google.com/maps?q=Maharashtra,India&output=embed"
            className="h-full min-h-[320px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
