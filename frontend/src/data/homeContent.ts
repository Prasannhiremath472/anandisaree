/**
 * Homepage placeholder imagery — real saree/Indian-wear photography sourced from
 * Unsplash (free-to-use), individually verified to depict actual sarees.
 * Swap these URLs for real Cloudinary product/lifestyle photography at launch —
 * no component code needs to change, only the values here.
 */

const unsplash = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Verified saree photography
const IMG_BRIDAL_MAROON_GOLD = "photo-1769500804057-ca1391bf4617"; // full-figure maroon/gold bridal saree
const IMG_GREEN_RED_CLOSEUP = "photo-1768341395956-fed92f537228"; // green & red saree, gold jewelry close-up
const IMG_STREET_GROUP = "photo-1594761253360-2a487accc7bc"; // women walking in colorful sarees
const IMG_PINK_SILK_BRIDAL = "photo-1742891603547-950f510710d7"; // pink/magenta silk bridal portrait
const IMG_RED_BRIDAL = "photo-1697347811496-c57e2ddc0b94"; // rich red bridal saree look
const IMG_GREEN_GOLD_SILK = "photo-1745482036066-5d215ed6b910"; // green & gold silk saree
const IMG_YELLOW_CONTRAST = "photo-1734527225029-a202aec0ad98"; // yellow saree, contrast border
const IMG_PINK_ORANGE_BRIDAL = "photo-1617627143750-d86bc21e42bb"; // pink/orange bridal saree between trees
const IMG_DRAPED_FABRIC = "photo-1617331721458-bd3bd3f9c7f8"; // draped silk fabric, floral print

// Flat-lay / product-style shots (folded saree, no model) — for catalog-style product cards
const IMG_FLATLAY_TEAL_SILK = "photo-1676696706907-0e04665b80bd"; // teal silk drape, flat lay
const IMG_FLATLAY_STACK_TASSELS = "photo-1717585679395-bbe39b5fb6bc"; // green/red/pink saree stack with tassels
const IMG_FLATLAY_RED_GOLD_BORDER = "photo-1588140686379-1b76a52103dc"; // red & gold zari border, folded
const IMG_FLATLAY_PINK_SILK = "photo-1676893140066-df87af3bc566"; // pink silk drape, close-up texture

export const HERO_SLIDES = [
  {
    id: "paithani",
    eyebrow: "Authentic Maharashtrian Craftsmanship",
    title: "Timeless Paithani, Woven With Heritage",
    subtitle: "Handloom silk sarees with rich zari borders, crafted by Yeola's master weavers.",
    ctaLabel: "Shop Paithani",
    ctaHref: "/category/paithani",
    image: unsplash(IMG_BRIDAL_MAROON_GOLD, 1800),
  },
  {
    id: "nauvari",
    eyebrow: "Nine Yards of Tradition",
    title: "The Nauvari Collection",
    subtitle: "Ready-to-wear and traditional Kashta drapes for every Maharashtrian occasion.",
    ctaLabel: "Explore Nauvari",
    ctaHref: "/category/nauvari",
    image: unsplash(IMG_STREET_GROUP, 1800),
  },
  {
    id: "wedding",
    eyebrow: "Bridal & Wedding Edit",
    title: "Maharashtrian Wedding Collection",
    subtitle: "Curated bridal Paithani and silk sarees for haldi, sangeet and reception.",
    ctaLabel: "View Wedding Edit",
    ctaHref: "/collection/maharashtrian-wedding",
    image: unsplash(IMG_PINK_SILK_BRIDAL, 1800),
  },
] as const;

export const FEATURED_CATEGORIES = [
  { name: "Paithani Sarees", slug: "paithani", image: unsplash(IMG_BRIDAL_MAROON_GOLD) },
  { name: "Nauvari Sarees", slug: "nauvari", image: unsplash(IMG_STREET_GROUP) },
  { name: "Narayan Peth", slug: "narayan-peth", image: unsplash(IMG_YELLOW_CONTRAST) },
  { name: "Solapuri Cotton", slug: "solapuri-cotton", image: unsplash(IMG_DRAPED_FABRIC) },
  { name: "Handloom Collection", slug: "handloom", image: unsplash(IMG_GREEN_GOLD_SILK) },
  { name: "Designer Sarees", slug: "designer", image: unsplash(IMG_PINK_ORANGE_BRIDAL) },
] as const;

export const ARTISAN_STORY_IMAGE = unsplash(IMG_STREET_GROUP, 1000);

export const GUDI_PADWA_COLLECTION = {
  title: "Gudi Padwa Special Collection",
  subtitle: "Celebrate the Marathi New Year in traditional Nauvari and Paithani drapes.",
  image: unsplash(IMG_YELLOW_CONTRAST, 1800),
  ctaHref: "/collection/gudi-padwa",
};

export const FESTIVE_COLLECTION = {
  title: "Festive Collection",
  subtitle: "Diwali, Navratri and Ganesh Chaturthi ready — rich colors, traditional motifs.",
  image: unsplash(IMG_GREEN_GOLD_SILK, 1800),
  ctaHref: "/collection/festive",
};

export interface ProductCard {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  fabric: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  stockQuantity?: number;
  sizes?: string[];
}

export const NEW_ARRIVALS: ProductCard[] = [
  { id: "p1", name: "Yeola Pure Silk Paithani", category: "Paithani", price: 18999, mrp: 24999, image: unsplash(IMG_FLATLAY_RED_GOLD_BORDER, 800), fabric: "Pure Silk", isNew: true },
  { id: "p2", name: "Peacock Motif Nauvari", category: "Nauvari", price: 6499, mrp: 8999, image: unsplash(IMG_FLATLAY_STACK_TASSELS, 800), fabric: "Cotton Silk", isNew: true },
  { id: "p3", name: "Narayan Peth Handloom", category: "Narayan Peth", price: 5299, mrp: 6999, image: unsplash(IMG_FLATLAY_TEAL_SILK, 800), fabric: "Cotton", isNew: true },
  { id: "p4", name: "Muniya Border Paithani", category: "Paithani", price: 21999, mrp: 27999, image: unsplash(IMG_FLATLAY_PINK_SILK, 800), fabric: "Pure Silk", isNew: true },
];

export const BEST_SELLERS: ProductCard[] = [
  { id: "b1", name: "Bangdi Mor Paithani", category: "Paithani", price: 16999, mrp: 21999, image: unsplash(IMG_FLATLAY_STACK_TASSELS, 800), fabric: "Semi Silk", isBestSeller: true },
  { id: "b2", name: "Solapuri Cotton Handloom", category: "Solapuri Cotton", price: 3299, mrp: 4299, image: unsplash(IMG_DRAPED_FABRIC, 800), fabric: "Cotton", isBestSeller: true },
  { id: "b3", name: "Ready-to-Wear Nauvari", category: "Nauvari", price: 4999, mrp: 6499, image: unsplash(IMG_FLATLAY_RED_GOLD_BORDER, 800), fabric: "Silk Blend", isBestSeller: true },
  { id: "b4", name: "Asawali Paithani Silk", category: "Paithani", price: 23999, mrp: 29999, image: unsplash(IMG_FLATLAY_TEAL_SILK, 800), fabric: "Pure Silk", isBestSeller: true },
];

/** Combined placeholder catalog for category/collection listing pages. */
export const ALL_PRODUCTS: ProductCard[] = [...NEW_ARRIVALS, ...BEST_SELLERS];

export interface RecentOrder {
  id: string;
  buyerName: string;
  city: string;
  productName: string;
  productImage: string;
  price: number;
  orderCode: string;
  minutesAgo: number;
}

/** Placeholder "recently ordered" entries for the social-proof popup. Swap for real order feed later. */
export const RECENT_ORDERS: RecentOrder[] = [
  { id: "ro1", buyerName: "Sonal Agarwal", city: "Pune", productName: "Yeola Pure Silk Paithani", productImage: unsplash(IMG_FLATLAY_RED_GOLD_BORDER, 200), price: 18999, orderCode: "ORD-3124", minutesAgo: 4 },
  { id: "ro2", buyerName: "Priya Deshmukh", city: "Nashik", productName: "Peacock Motif Nauvari", productImage: unsplash(IMG_FLATLAY_STACK_TASSELS, 200), price: 6499, orderCode: "ORD-3119", minutesAgo: 9 },
  { id: "ro3", buyerName: "Kavita Joshi", city: "Mumbai", productName: "Narayan Peth Handloom", productImage: unsplash(IMG_FLATLAY_TEAL_SILK, 200), price: 5299, orderCode: "ORD-3112", minutesAgo: 14 },
  { id: "ro4", buyerName: "Ashwini Kulkarni", city: "Nagpur", productName: "Bangdi Mor Paithani", productImage: unsplash(IMG_FLATLAY_STACK_TASSELS, 200), price: 16999, orderCode: "ORD-3107", minutesAgo: 21 },
  { id: "ro5", buyerName: "Meera Patil", city: "Kolhapur", productName: "Solapuri Cotton Handloom", productImage: unsplash(IMG_DRAPED_FABRIC, 200), price: 3299, orderCode: "ORD-3098", minutesAgo: 28 },
];

/** Friendly titles/descriptions for known category and collection slugs (nav links, footer links). */
export const CATEGORY_INFO: Record<string, { title: string; description: string }> = {
  paithani: {
    title: "Paithani Sarees",
    description: "Handloom silk Paithani sarees with rich zari borders, woven by Yeola's master artisans.",
  },
  nauvari: {
    title: "Nauvari Sarees",
    description: "Traditional nine-yard Maharashtrian drapes, ready-to-wear and classic Kashta styles.",
  },
  "narayan-peth": {
    title: "Narayan Peth Sarees",
    description: "Narayan Peth handloom sarees known for their understated elegance and durability.",
  },
  "solapuri-cotton": {
    title: "Solapuri Cotton Sarees",
    description: "Breathable, handwoven Solapur cotton sarees perfect for daily and office wear.",
  },
  handloom: {
    title: "Handloom Collection",
    description: "Authentic handloom weaves sourced directly from Maharashtra's weaver clusters.",
  },
  designer: {
    title: "Designer Sarees",
    description: "Contemporary designer sarees blending traditional motifs with modern silhouettes.",
  },
};

export const COLLECTION_INFO: Record<string, { title: string; description: string }> = {
  "maharashtrian-wedding": {
    title: "Maharashtrian Wedding Collection",
    description: "Curated bridal Paithani and silk sarees for haldi, sangeet and reception.",
  },
  festive: {
    title: "Festive Collection",
    description: "Diwali, Navratri and Ganesh Chaturthi ready — rich colors, traditional motifs.",
  },
  "gudi-padwa": {
    title: "Gudi Padwa Special Collection",
    description: "Celebrate the Marathi New Year in traditional Nauvari and Paithani drapes.",
  },
  handloom: {
    title: "Handloom Collection",
    description: "Authentic handloom weaves sourced directly from Maharashtra's weaver clusters.",
  },
};

export const TESTIMONIALS = [
  {
    name: "Anjali Deshmukh",
    location: "Pune, Maharashtra",
    rating: 5,
    message:
      "The Yeola Paithani I ordered for my daughter's wedding was beyond beautiful. The zari work and finishing felt truly handwoven — worth every rupee.",
  },
  {
    name: "Snehal Patil",
    location: "Nashik, Maharashtra",
    rating: 5,
    message:
      "Bought a Nauvari for Gudi Padwa and the fit and drape were perfect. Delivery was quick and the packaging felt premium.",
  },
  {
    name: "Radhika Kulkarni",
    location: "Mumbai, Maharashtra",
    rating: 5,
    message:
      "Authentic Solapuri cotton sarees, exactly as pictured. Customer support helped me pick the right blouse size over WhatsApp.",
  },
] as const;

export const INSTAGRAM_IMAGES = [
  unsplash(IMG_BRIDAL_MAROON_GOLD, 500),
  unsplash(IMG_GREEN_RED_CLOSEUP, 500),
  unsplash(IMG_STREET_GROUP, 500),
  unsplash(IMG_PINK_SILK_BRIDAL, 500),
  unsplash(IMG_GREEN_GOLD_SILK, 500),
  unsplash(IMG_YELLOW_CONTRAST, 500),
  unsplash(IMG_RED_BRIDAL, 500),
] as const;

export const WHY_CHOOSE_US = [
  { title: "Authentic Handloom", description: "Sourced directly from Yeola, Paithan and Solapur weaver clusters." },
  { title: "Certified Purity", description: "Every silk saree comes with a purity and craftsmanship guarantee." },
  { title: "Pan-India Delivery", description: "Safely packaged and delivered across India within 5-7 days." },
  { title: "Easy Returns", description: "7-day hassle-free return and exchange on all orders." },
] as const;
