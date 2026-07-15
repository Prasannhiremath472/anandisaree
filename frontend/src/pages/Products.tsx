import { ProductCard } from "@/components/home/ProductCard";
import { ALL_PRODUCTS } from "@/data/homeContent";

export function Products() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-gradient-royal sm:text-4xl">All Sarees</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal/70">
          Browse our full collection of authentic Maharashtrian and premium Indian sarees.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {ALL_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
