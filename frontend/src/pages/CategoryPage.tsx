import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/home/ProductCard";
import { ALL_PRODUCTS, CATEGORY_INFO, COLLECTION_INFO } from "@/data/homeContent";

interface CategoryPageProps {
  kind: "category" | "collection";
}

function toTitleCase(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function CategoryPage({ kind }: CategoryPageProps) {
  const { slug = "" } = useParams<{ slug: string }>();
  const info = (kind === "category" ? CATEGORY_INFO : COLLECTION_INFO)[slug];

  const title = info?.title ?? toTitleCase(slug);
  const description =
    info?.description ?? "Explore this collection of authentic Maharashtrian and premium Indian sarees.";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 rounded-xl2 bg-royal-gradient px-8 py-12 text-center text-cream-100 shadow-soft"
      >
        <span className="font-heading text-xs uppercase tracking-[0.3em] text-gold-300">
          {kind === "category" ? "Category" : "Collection"}
        </span>
        <h1 className="mt-3 text-balance font-display text-3xl sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-cream-200">{description}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {ALL_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
