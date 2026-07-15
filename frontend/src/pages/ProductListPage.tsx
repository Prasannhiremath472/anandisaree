import { ProductCard } from "@/components/home/ProductCard";
import type { ProductCard as ProductCardData } from "@/data/homeContent";

interface ProductListPageProps {
  title: string;
  description: string;
  products: ProductCardData[];
}

export function ProductListPage({ title, description, products }: ProductListPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-gradient-royal sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal/70">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
