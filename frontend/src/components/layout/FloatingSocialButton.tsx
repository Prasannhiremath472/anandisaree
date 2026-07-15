import { useState } from "react";
import { Facebook, Instagram, MessageCircle, Plus, Youtube } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BUSINESS } from "@/data/business";

const SOCIAL_LINKS = [
  {
    label: "WhatsApp",
    href: `https://wa.me/${BUSINESS.phoneRaw}`,
    icon: MessageCircle,
    className: "bg-[#25D366] text-white",
  },
  {
    label: "Facebook",
    href: BUSINESS.social.facebook,
    icon: Facebook,
    className: "bg-[#1877F2] text-white",
  },
  {
    label: "Instagram",
    href: BUSINESS.social.instagram,
    icon: Instagram,
    className: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white",
  },
  {
    label: "YouTube",
    href: BUSINESS.social.youtube,
    icon: Youtube,
    className: "bg-[#FF0000] text-white",
  },
];

export function FloatingSocialButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      <AnimatePresence>
        {open &&
          SOCIAL_LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              initial={{ opacity: 0, y: 10, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.6 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className={`flex h-11 w-11 items-center justify-center rounded-full shadow-lg ${link.className}`}
            >
              <link.icon className="h-5 w-5" />
            </motion.a>
          ))}
      </AnimatePresence>

      <button
        aria-label={open ? "Close social links" : "Open social links"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-royal-gradient text-white shadow-soft transition-transform hover:scale-105"
      >
        <motion.span animate={{ rotate: open ? 135 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="h-5 w-5" />
        </motion.span>
      </button>
    </div>
  );
}
