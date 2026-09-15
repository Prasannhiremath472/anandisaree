import { Facebook, Instagram, MessageCircle, Youtube } from "lucide-react";
import { BUSINESS } from "@/data/business";

const RIGHT_LINKS = [
  {
    label: "WhatsApp",
    href: `https://wa.me/${BUSINESS.phoneRaw}`,
    icon: MessageCircle,
    className: "bg-[#25D366] text-white",
  },
  {
    label: "Instagram",
    href: BUSINESS.social.instagram,
    icon: Instagram,
    className: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white",
  },
];

const LEFT_LINKS = [
  {
    label: "Facebook",
    href: BUSINESS.social.facebook,
    icon: Facebook,
    className: "bg-[#1877F2] text-white",
  },
  {
    label: "YouTube",
    href: BUSINESS.social.youtube,
    icon: Youtube,
    className: "bg-[#FF0000] text-white",
  },
];

export function FloatingSocialButton() {
  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
        {RIGHT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 ${link.className}`}
          >
            <link.icon className="h-5 w-5" />
          </a>
        ))}
      </div>

      <div className="fixed bottom-5 left-5 z-40 flex flex-col items-center gap-3">
        {LEFT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 ${link.className}`}
          >
            <link.icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </>
  );
}
