import { ProductCard } from "@/components/home/ProductCard";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";

interface ProductListPageProps {
  title: string;
  description: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export function ProductListPage({ title, description, isNewArrival, isBestSeller }: ProductListPageProps) {
  const { data: products = [], isLoading } = useStorefrontProducts({
    isNewArrival,
    isBestSeller,
    pageSize: 100,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-gradient-royal sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal/70">{description}</p>
      </div>

      {isLoading ? (
        <p className="text-center text-sm text-charcoal/60">Loading products...</p>
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
