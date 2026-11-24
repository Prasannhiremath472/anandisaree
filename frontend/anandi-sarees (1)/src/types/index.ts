export type SareeCategory = 
  | 'all'
  | 'paithani'
  | 'nauvari'
  | 'narayan-peth'
  | 'solapuri-cotton'
  | 'handloom'
  | 'designer'
  | 'wedding'
  | 'festive'
  | 'under-999'
  | 'best-sellers'
  | 'new-arrivals';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  story?: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  images: string[];
  category: string;
  categoryLabel: string;
  fabric: string;
  color: string;
  colorHex?: string;
  occasion: string;
  weavingStyle: string;
  badge?: 'NEW' | 'BEST SELLER' | 'TOP TRENDING' | 'ONLY 2 LEFT' | 'HANDLOOM AUTHENTIC';
  availability: 'In Stock' | 'Only 2 Left' | 'Made to Order';
  featured: boolean;
  bestseller: boolean;
  rating: number;
  reviewCount: number;
  length: string;
  blouseDetails: string;
  careInstructions: string[];
  origin: string;
  dispatchTime: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  blouseStitching?: 'unstitched' | 'standard' | 'custom';
}

export interface CraftStory {
  id: string;
  name: string;
  subName: string;
  catchphrase: string;
  description: string;
  image: string;
  slug: string;
  origin: string;
  patternType: string;
}

export interface OccasionItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  slug: string;
  colSpan?: string;
  accent: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  occasion: string;
  review: string;
  rating: number;
  sareePurchased: string;
  date: string;
  verified: boolean;
  avatar?: string;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  fabrics: string[];
  colors: string[];
  occasions: string[];
  weavingStyles: string[];
  availability: string[];
  sortBy: 'featured' | 'price-low-to-high' | 'price-high-to-low' | 'newest' | 'rating' | 'discount';
}
