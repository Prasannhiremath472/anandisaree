import { Link } from "react-router-dom";
import { FEATURED_CATEGORIES } from "@/data/homeContent";

export function CategoryIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-gradient-royal sm:text-4xl">Shop By Category</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal/70">
          Explore our Maharashtrian and premium Indian saree categories.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {FEATURED_CATEGORIES.map((cat) => (
          <Link key={cat.slug} to={`/category/${cat.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl2 shadow-soft">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-900/70 via-transparent to-transparent" />
            </div>
            <p className="mt-3 text-center font-heading text-sm font-medium text-charcoal group-hover:text-royal-600">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
