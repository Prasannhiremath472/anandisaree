import { Heart } from "lucide-react";

export function Wishlist() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-ds-6 py-24 text-center lg:px-ds-8">
      <Heart className="h-12 w-12 text-royal-300" />
      <h1 className="mt-ds-7 font-display text-3xl text-gradient-royal">Your Wishlist is Empty</h1>
      <p className="mt-ds-4 text-ds-sm text-charcoal/70">
        Save sarees you love while browsing and they'll show up here.
      </p>
    </div>
  );
}
