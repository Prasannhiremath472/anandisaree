import { Reels } from "@/components/home/Reels";
import { InstagramGallery } from "@/components/home/InstagramGallery";

export function Gallery() {
  return (
    <div className="py-ds-8">
      <div className="mx-auto max-w-7xl px-ds-6 text-center lg:px-ds-8">
        <h1 className="font-display text-3xl text-gradient-royal sm:text-4xl">Style Gallery</h1>
        <p className="mx-auto mt-ds-4 max-w-xl text-ds-sm text-charcoal/70">
          Reels, customer looks and behind-the-scenes from Anandi Sarees.
        </p>
      </div>
      <Reels />
      <InstagramGallery />
    </div>
  );
}
