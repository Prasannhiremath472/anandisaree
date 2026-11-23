export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  highlightText?: string;
}

export const categories: CategoryItem[] = [
  {
    id: 'cat-paithani',
    name: 'Paithani Sarees',
    slug: 'paithani',
    description: 'The Queen of Sarees from Yeola and Paithan featuring pure gold zari and peacock pallus.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    productCount: 48,
    highlightText: 'Pure Silk & Zari'
  },
  {
    id: 'cat-nauvari',
    name: 'Nauvari Sarees',
    slug: 'nauvari',
    description: 'Traditional 9-yard Maharashtrian heritage sarees for royal bridal and ritual drapes.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    productCount: 32,
    highlightText: '9-Yard Authentic Drape'
  },
  {
    id: 'cat-narayan-peth',
    name: 'Narayan Peth',
    slug: 'narayan-peth',
    description: 'Centuries-old silk and cotton sarees famed for the distinctive double-shaded body and rudraksha border.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    productCount: 26,
    highlightText: 'Temple Border Weave'
  },
  {
    id: 'cat-solapuri-cotton',
    name: 'Solapuri Cotton',
    slug: 'solapuri-cotton',
    description: 'Bespoke handspun combed cotton sarees with traditional temple borders and breathable comfort.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    productCount: 38,
    highlightText: 'Breathable Handloom'
  },
  {
    id: 'cat-handloom',
    name: 'Handloom Sarees',
    slug: 'handloom',
    description: 'Artisanal weaves crafted on traditional wooden pit-looms by generational master weavers.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    productCount: 54,
    highlightText: 'Master Artisan Craft'
  },
  {
    id: 'cat-designer',
    name: 'Designer Sarees',
    slug: 'designer',
    description: 'Modern silhouettes, mashru silk, and contemporary colors woven with timeless Indian sensibility.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    productCount: 42,
    highlightText: 'Festive & Contemporary'
  }
];
