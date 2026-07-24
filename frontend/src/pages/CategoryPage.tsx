import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/home/ProductCard";
import { CATEGORY_INFO, COLLECTION_INFO } from "@/data/homeContent";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { apiClient } from "@/api/client";

interface CategoryPageProps {
  kind: "category" | "collection";
}

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
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

  const { data: categories = [] } = useQuery({
    queryKey: ["storefront-categories"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: ApiCategory[] }>(
        "/storefront/categories"
      );
      return data.data;
    },
    enabled: kind === "category",
  });

  const categoryId = kind === "category" ? categories.find((c) => c.slug === slug)?.id : undefined;
  const { data: products = [], isLoading } = useStorefrontProducts({
    categoryId,
    pageSize: 100,
  });

  const title = info?.title ?? toTitleCase(slug);
  const description =
    info?.description ?? "Explore this collection of authentic Maharashtrian and premium Indian sarees.";

  return (
    <div className="mx-auto max-w-7xl px-ds-6 py-12 lg:px-ds-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 rounded-xl2 bg-royal-gradient px-ds-8 py-12 text-center text-cream-100 shadow-soft"
      >
        <span className="font-heading text-ds-xs uppercase tracking-[0.3em] text-gold-300">
          {kind === "category" ? "Category" : "Collection"}
        </span>
        <h1 className="mt-ds-4 text-balance font-display text-3xl sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-ds-6 max-w-xl text-ds-sm text-cream-200">{description}</p>
      </motion.div>

      {isLoading ? (
        <p className="text-center text-ds-sm text-charcoal/60">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-ds-sm text-charcoal/60">No products found in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
