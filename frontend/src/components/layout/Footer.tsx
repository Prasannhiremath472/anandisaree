import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { BUSINESS } from "@/data/business";

export function Footer() {
  return (
    <footer className="mt-24 bg-[linear-gradient(180deg,#211F1E_0%,#2D124C_120%)] text-cream-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-ds-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-ds-8">
        <div>
          <img
            src="/images/anandi-sarees-logo-crop.png"
            alt={BUSINESS.name}
            className="h-12 w-auto rounded"
          />
          <p className="mt-ds-6 text-ds-sm text-cream-300">
            A premium Maharashtrian saree boutique celebrating Paithani, Nauvari and handloom
            craftsmanship, alongside curated collections from across India.
          </p>
          <div className="mt-5 flex gap-ds-6">
            <a href={BUSINESS.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="h-5 w-5 cursor-pointer hover:text-gold-400" />
            </a>
            <a href={BUSINESS.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-gold-400" />
            </a>
            <a href={BUSINESS.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
              <Youtube className="h-5 w-5 cursor-pointer hover:text-gold-400" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-ds-sm font-semibold uppercase tracking-wide text-gold-400">
            Collections
          </h4>
          <ul className="mt-ds-6 space-y-ds-2 text-ds-sm text-cream-300">
            <li><Link to="/category/paithani" className="hover:text-white">Paithani Sarees</Link></li>
            <li><Link to="/category/nauvari" className="hover:text-white">Nauvari Sarees</Link></li>
            <li><Link to="/collection/maharashtrian-wedding" className="hover:text-white">Wedding Collection</Link></li>
            <li><Link to="/collection/handloom" className="hover:text-white">Handloom Collection</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-ds-sm font-semibold uppercase tracking-wide text-gold-400">
            Company
          </h4>
          <ul className="mt-ds-6 space-y-ds-2 text-ds-sm text-cream-300">
            <li><Link to="/about" className="hover:text-white">Our Story</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/policies/returns" className="hover:text-white">Returns &amp; Exchange</Link></li>
            <li><Link to="/policies/shipping" className="hover:text-white">Shipping Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-ds-sm font-semibold uppercase tracking-wide text-gold-400">
            Get In Touch
          </h4>
          <ul className="mt-ds-6 space-y-ds-4 text-ds-sm text-cream-300">
            <li className="flex gap-ds-2"><MapPin className="h-4 w-4 shrink-0 text-gold-400" /> {BUSINESS.address}</li>
            <li className="flex gap-ds-2">
              <Phone className="h-4 w-4 shrink-0 text-gold-400" />
              <a href={`tel:${BUSINESS.phoneRaw}`} className="hover:text-white">{BUSINESS.phone}</a>
            </li>
            <li className="flex gap-ds-2">
              <Mail className="h-4 w-4 shrink-0 text-gold-400" />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-white">{BUSINESS.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-ds-7 text-center text-ds-xs text-cream-300">
        © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
      </div>
    </footer>
  );
}
