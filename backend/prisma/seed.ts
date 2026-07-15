import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  MAHARASHTRIAN_CATEGORIES,
  PAN_INDIAN_CATEGORIES,
  OCCASIONS,
  SEO_LANDING_PAGES,
} from "@anandi/shared";

const prisma = new PrismaClient();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const unsplash = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Verified real saree photography (same set used on the storefront)
const IMG_BRIDAL_MAROON_GOLD = "photo-1769500804057-ca1391bf4617";
const IMG_GREEN_RED_CLOSEUP = "photo-1768341395956-fed92f537228";
const IMG_STREET_GROUP = "photo-1594761253360-2a487accc7bc";
const IMG_PINK_SILK_BRIDAL = "photo-1742891603547-950f510710d7";
const IMG_RED_BRIDAL = "photo-1697347811496-c57e2ddc0b94";
const IMG_GREEN_GOLD_SILK = "photo-1745482036066-5d215ed6b910";
const IMG_YELLOW_CONTRAST = "photo-1734527225029-a202aec0ad98";
const IMG_PINK_ORANGE_BRIDAL = "photo-1617627143750-d86bc21e42bb";
const IMG_DRAPED_FABRIC = "photo-1617331721458-bd3bd3f9c7f8";
const IMG_FLATLAY_TEAL_SILK = "photo-1676696706907-0e04665b80bd";
const IMG_FLATLAY_STACK_TASSELS = "photo-1717585679395-bbe39b5fb6bc";
const IMG_FLATLAY_RED_GOLD_BORDER = "photo-1588140686379-1b76a52103dc";
const IMG_FLATLAY_PINK_SILK = "photo-1676893140066-df87af3bc566";

async function seedCategories() {
  for (const category of MAHARASHTRIAN_CATEGORIES) {
    const parent = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        group: "MAHARASHTRIAN",
      },
    });

    for (const childName of category.children) {
      const childSlug = `${category.slug}-${slugify(childName)}`;
      await prisma.category.upsert({
        where: { slug: childSlug },
        update: {},
        create: {
          name: childName,
          slug: childSlug,
          group: "MAHARASHTRIAN",
          parentId: parent.id,
        },
      });
    }
  }

  for (const name of PAN_INDIAN_CATEGORIES) {
    const slug = slugify(name);
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, group: "PAN_INDIAN" },
    });
  }
}

async function seedOccasions() {
  for (const name of OCCASIONS) {
    const slug = slugify(name);
    await prisma.occasion.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }
}

async function seedLandingPages() {
  for (const page of SEO_LANDING_PAGES) {
    await prisma.landingPage.upsert({
      where: { slug: page.slug },
      update: {},
      create: { slug: page.slug, title: page.title },
    });
  }
}

async function seedSuperAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@anandisaree.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isEmailVerified: true,
    },
  });

  console.log(`Seeded super admin: ${email} (password from SEED_ADMIN_PASSWORD env or default)`);
}

// ============================================================
// DEMO DATA — products, customers, orders, reviews, coupons, banners
// ============================================================

interface DemoProduct {
  sku: string;
  name: string;
  categorySlug: string;
  fabric: string;
  color: string;
  borderType?: string;
  palluDesign?: string;
  designPattern?: string;
  isHandloom: boolean;
  craftOrigin: string;
  district: string;
  mrp: number;
  sellingPrice: number;
  stockQuantity: number;
  image: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  soldCount: number;
}

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    sku: "PTH-YL-001",
    name: "Yeola Pure Silk Paithani – Peacock Motif",
    categorySlug: "paithani",
    fabric: "Pure Silk",
    color: "Maroon",
    borderType: "Muniya Border",
    palluDesign: "Peacock Pallu",
    designPattern: "Peacock",
    isHandloom: true,
    craftOrigin: "Yeola",
    district: "Nashik",
    mrp: 24999,
    sellingPrice: 18999,
    stockQuantity: 8,
    image: unsplash(IMG_FLATLAY_RED_GOLD_BORDER, 1000),
    isFeatured: true,
    isNewArrival: true,
    soldCount: 34,
  },
  {
    sku: "PTH-YL-002",
    name: "Bangdi Mor Paithani – Semi Silk",
    categorySlug: "paithani",
    fabric: "Semi Silk",
    color: "Bottle Green",
    borderType: "Bangdi Mor Border",
    palluDesign: "Traditional Maharashtrian Pallu",
    designPattern: "Bangdi Mor",
    isHandloom: true,
    craftOrigin: "Yeola",
    district: "Nashik",
    mrp: 21999,
    sellingPrice: 16999,
    stockQuantity: 12,
    image: unsplash(IMG_FLATLAY_STACK_TASSELS, 1000),
    isBestSeller: true,
    soldCount: 58,
  },
  {
    sku: "PTH-AS-003",
    name: "Asawali Paithani Silk – Wedding Edit",
    categorySlug: "paithani",
    fabric: "Pure Silk",
    color: "Wine",
    borderType: "Zari Border",
    palluDesign: "Asawali Pallu",
    designPattern: "Asawali",
    isHandloom: true,
    craftOrigin: "Paithan",
    district: "Chhatrapati Sambhajinagar",
    mrp: 29999,
    sellingPrice: 23999,
    stockQuantity: 5,
    image: unsplash(IMG_BRIDAL_MAROON_GOLD, 1000),
    isFeatured: true,
    soldCount: 21,
  },
  {
    sku: "PTH-NR-004",
    name: "Narali Border Paithani – Kesari",
    categorySlug: "paithani",
    fabric: "Tissue Silk",
    color: "Kesari (Saffron)",
    borderType: "Narali Border",
    palluDesign: "Lotus Pallu",
    designPattern: "Lotus",
    isHandloom: true,
    craftOrigin: "Yeola",
    district: "Nashik",
    mrp: 19999,
    sellingPrice: 15499,
    stockQuantity: 10,
    image: unsplash(IMG_YELLOW_CONTRAST, 1000),
    isNewArrival: true,
    soldCount: 15,
  },
  {
    sku: "NAU-RW-001",
    name: "Peacock Motif Nauvari – Ready to Wear",
    categorySlug: "nauvari",
    fabric: "Cotton Silk",
    color: "Rani Pink",
    borderType: "Temple Border",
    designPattern: "Peacock",
    isHandloom: false,
    craftOrigin: "Kolhapur",
    district: "Kolhapur",
    mrp: 8999,
    sellingPrice: 6499,
    stockQuantity: 20,
    image: unsplash(IMG_STREET_GROUP, 1000),
    isNewArrival: true,
    soldCount: 47,
  },
  {
    sku: "NAU-CT-002",
    name: "Traditional Cotton Nauvari – Kashta Style",
    categorySlug: "nauvari",
    fabric: "Cotton",
    color: "Turquoise",
    borderType: "Contrast Border",
    isHandloom: true,
    craftOrigin: "Solapur",
    district: "Solapur",
    mrp: 4299,
    sellingPrice: 3299,
    stockQuantity: 25,
    image: unsplash(IMG_DRAPED_FABRIC, 1000),
    soldCount: 62,
  },
  {
    sku: "NAU-SK-003",
    name: "Silk Nauvari – Festive Collection",
    categorySlug: "nauvari",
    fabric: "Silk Blend",
    color: "Emerald Green",
    borderType: "Zari Border",
    isHandloom: false,
    craftOrigin: "Pune",
    district: "Pune",
    mrp: 6499,
    sellingPrice: 4999,
    stockQuantity: 14,
    image: unsplash(IMG_RED_BRIDAL, 1000),
    isBestSeller: true,
    soldCount: 39,
  },
  {
    sku: "NPT-HL-001",
    name: "Narayan Peth Handloom Cotton Saree",
    categorySlug: "narayan-peth",
    fabric: "Cotton",
    color: "Mustard Yellow",
    borderType: "Plain Border",
    isHandloom: true,
    craftOrigin: "Narayan Peth, Pune",
    district: "Pune",
    mrp: 6999,
    sellingPrice: 5299,
    stockQuantity: 16,
    image: unsplash(IMG_FLATLAY_TEAL_SILK, 1000),
    isNewArrival: true,
    soldCount: 18,
  },
  {
    sku: "SLP-CT-001",
    name: "Solapuri Cotton Handloom – Daily Wear",
    categorySlug: "solapuri-cotton",
    fabric: "Cotton",
    color: "Beige",
    borderType: "Plain Border",
    isHandloom: true,
    craftOrigin: "Solapur",
    district: "Solapur",
    mrp: 4299,
    sellingPrice: 3299,
    stockQuantity: 30,
    image: unsplash(IMG_FLATLAY_TEAL_SILK, 1000),
    isBestSeller: true,
    soldCount: 71,
  },
  {
    sku: "SLP-CT-002",
    name: "Solapuri Cotton – Office Wear Stripes",
    categorySlug: "solapuri-cotton",
    fabric: "Cotton",
    color: "Peacock Blue",
    borderType: "Contrast Border",
    designPattern: "Stripes",
    isHandloom: true,
    craftOrigin: "Solapur",
    district: "Solapur",
    mrp: 3799,
    sellingPrice: 2899,
    stockQuantity: 22,
    image: unsplash(IMG_GREEN_GOLD_SILK, 1000),
    soldCount: 28,
  },
  {
    sku: "HDL-KH-001",
    name: "Khun Fabric Handloom Saree",
    categorySlug: "handloom",
    fabric: "Khun Fabric",
    color: "Purple",
    borderType: "Temple Border",
    isHandloom: true,
    craftOrigin: "Kolhapur",
    district: "Kolhapur",
    mrp: 7499,
    sellingPrice: 5999,
    stockQuantity: 9,
    image: unsplash(IMG_GREEN_RED_CLOSEUP, 1000),
    isFeatured: true,
    soldCount: 12,
  },
  {
    sku: "HDL-IL-002",
    name: "Ilkal Handloom Silk Saree",
    categorySlug: "handloom",
    fabric: "Art Silk",
    color: "Royal Blue",
    borderType: "Temple Border",
    isHandloom: true,
    craftOrigin: "Solapur border region",
    district: "Solapur",
    mrp: 8999,
    sellingPrice: 6999,
    stockQuantity: 11,
    image: unsplash(IMG_PINK_ORANGE_BRIDAL, 1000),
    soldCount: 9,
  },
  {
    sku: "DSG-EM-001",
    name: "Designer Embroidered Georgette Saree",
    categorySlug: "designer",
    fabric: "Georgette",
    color: "Magenta",
    designPattern: "Embroidery",
    isHandloom: false,
    craftOrigin: "Mumbai",
    district: "Mumbai",
    mrp: 12999,
    sellingPrice: 9499,
    stockQuantity: 13,
    image: unsplash(IMG_PINK_SILK_BRIDAL, 1000),
    isNewArrival: true,
    soldCount: 24,
  },
  {
    sku: "DSG-PT-002",
    name: "Designer Party Wear Satin Silk Saree",
    categorySlug: "designer",
    fabric: "Satin",
    color: "Black",
    designPattern: "Stone Work",
    isHandloom: false,
    craftOrigin: "Mumbai",
    district: "Mumbai",
    mrp: 10999,
    sellingPrice: 7999,
    stockQuantity: 17,
    image: unsplash(IMG_FLATLAY_PINK_SILK, 1000),
    soldCount: 31,
  },
  {
    sku: "MWB-BR-001",
    name: "Maharashtrian Bridal Paithani – Premium",
    categorySlug: "maharashtrian-bridal",
    fabric: "Pure Silk",
    color: "Red",
    borderType: "Antique Gold Border",
    palluDesign: "Rich Zari Pallu",
    isHandloom: true,
    craftOrigin: "Yeola",
    district: "Nashik",
    mrp: 34999,
    sellingPrice: 27999,
    stockQuantity: 4,
    image: unsplash(IMG_BRIDAL_MAROON_GOLD, 1000),
    isFeatured: true,
    soldCount: 7,
  },
  {
    sku: "MHD-FS-001",
    name: "Maharashtrian Festive Silk Saree",
    categorySlug: "maharashtrian-festive",
    fabric: "Pure Silk",
    color: "Parrot Green",
    borderType: "Zari Border",
    isHandloom: true,
    craftOrigin: "Paithan",
    district: "Chhatrapati Sambhajinagar",
    mrp: 15999,
    sellingPrice: 12499,
    stockQuantity: 18,
    image: unsplash(IMG_GREEN_GOLD_SILK, 1000),
    soldCount: 26,
  },
];

async function seedProducts() {
  const existingCount = await prisma.product.count();
  if (existingCount > 0) {
    console.log(`Skipping product seed — ${existingCount} products already exist.`);
    return;
  }

  for (const p of DEMO_PRODUCTS) {
    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } });

    await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        slug: slugify(p.name),
        shortDescription: `Authentic ${p.fabric} saree in ${p.color.toLowerCase()}, handcrafted in ${p.craftOrigin}.`,
        description: `This ${p.name} is a part of our curated Maharashtrian saree collection. Woven from ${p.fabric.toLowerCase()}, it features ${(p.designPattern ?? p.borderType ?? "traditional")?.toLowerCase()} detailing and comes with an unstitched blouse piece. Sourced directly from artisans in ${p.craftOrigin}, ${p.district} district.`,
        fabric: p.fabric,
        weavingTechnique: p.isHandloom ? "Handloom" : "Machine Made",
        isHandloom: p.isHandloom,
        borderType: p.borderType,
        palluDesign: p.palluDesign,
        designPattern: p.designPattern,
        color: p.color,
        sareeLength: 5.5,
        blouseIncluded: true,
        blouseLength: 0.8,
        weightGrams: 650,
        craftOrigin: p.craftOrigin,
        state: "Maharashtra",
        district: p.district,
        weaverDetails: p.isHandloom ? "Handwoven by local artisan weaver families." : undefined,
        mrp: p.mrp,
        sellingPrice: p.sellingPrice,
        gstPercent: 5,
        stockQuantity: p.stockQuantity,
        lowStockThreshold: 5,
        dispatchDays: 2,
        deliveryEstimateDays: 7,
        washCare: "Dry clean only. Store in a muslin cloth away from direct sunlight.",
        isActive: true,
        isFeatured: p.isFeatured ?? false,
        isNewArrival: p.isNewArrival ?? false,
        isBestSeller: p.isBestSeller ?? false,
        publishedAt: new Date(),
        soldCount: p.soldCount,
        avgRating: 4.2 + Math.random() * 0.7,
        reviewCount: Math.floor(p.soldCount / 4),
        images: { create: [{ url: p.image, altText: p.name, isPrimary: true, sortOrder: 0 }] },
        categories: category ? { create: [{ categoryId: category.id }] } : undefined,
      },
    });
  }

  console.log(`Seeded ${DEMO_PRODUCTS.length} demo products.`);
}

interface DemoCustomer {
  name: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

const DEMO_CUSTOMERS: DemoCustomer[] = [
  { name: "Anjali Deshmukh", email: "anjali.deshmukh@example.com", phone: "9822011122", city: "Pune", district: "Pune", state: "Maharashtra", pincode: "411001" },
  { name: "Snehal Patil", email: "snehal.patil@example.com", phone: "9822033344", city: "Nashik", district: "Nashik", state: "Maharashtra", pincode: "422001" },
  { name: "Radhika Kulkarni", email: "radhika.kulkarni@example.com", phone: "9822055566", city: "Mumbai", district: "Mumbai", state: "Maharashtra", pincode: "400001" },
  { name: "Ashwini Joshi", email: "ashwini.joshi@example.com", phone: "9822077788", city: "Kolhapur", district: "Kolhapur", state: "Maharashtra", pincode: "416001" },
  { name: "Meera Bhosale", email: "meera.bhosale@example.com", phone: "9822099900", city: "Nagpur", district: "Nagpur", state: "Maharashtra", pincode: "440001" },
];

async function seedCustomers() {
  const existingCount = await prisma.user.count({ where: { role: "CUSTOMER" } });
  if (existingCount > 0) {
    console.log(`Skipping customer seed — ${existingCount} customers already exist.`);
    return prisma.user.findMany({ where: { role: "CUSTOMER" }, include: { addresses: true } });
  }

  const passwordHash = await bcrypt.hash("Customer@123", 12);
  const customers = [];

  for (const c of DEMO_CUSTOMERS) {
    const user = await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        passwordHash,
        role: "CUSTOMER",
        isEmailVerified: true,
        isPhoneVerified: true,
        wallet: { create: { balance: 0 } },
        addresses: {
          create: {
            fullName: c.name,
            phone: c.phone,
            line1: `${Math.floor(Math.random() * 900) + 100}, Shivaji Nagar`,
            city: c.city,
            district: c.district,
            state: c.state,
            pincode: c.pincode,
            isDefault: true,
          },
        },
      },
      include: { addresses: true },
    });
    customers.push(user);
  }

  console.log(`Seeded ${customers.length} demo customers.`);
  return customers;
}

async function seedOrders(customers: { id: string; addresses: { id: string }[] }[]) {
  const existingCount = await prisma.order.count();
  if (existingCount > 0) {
    console.log(`Skipping order seed — ${existingCount} orders already exist.`);
    return;
  }

  const products = await prisma.product.findMany();
  if (products.length === 0 || customers.length === 0) return;

  const statuses: ("DELIVERED" | "SHIPPED" | "PACKED" | "CONFIRMED" | "PENDING" | "CANCELLED")[] = [
    "DELIVERED",
    "DELIVERED",
    "DELIVERED",
    "SHIPPED",
    "PACKED",
    "CONFIRMED",
    "PENDING",
    "CANCELLED",
  ];

  for (let i = 0; i < statuses.length; i++) {
    const customer = customers[i % customers.length];
    const address = customer.addresses[0];
    if (!address) continue;

    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = 1;
    const unitPrice = Number(product.sellingPrice);
    const subtotal = unitPrice * quantity;
    const taxAmount = Math.round(subtotal * 0.05);
    const shippingAmount = subtotal > 4999 ? 0 : 99;
    const totalAmount = subtotal + taxAmount + shippingAmount;
    const status = statuses[i];
    const daysAgo = statuses.length - i;
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        orderNumber: `ANS${String(1000 + i)}`,
        userId: customer.id,
        addressId: address.id,
        status,
        paymentMethod: i % 3 === 0 ? "COD" : "RAZORPAY",
        paymentStatus: status === "CANCELLED" ? "REFUNDED" : status === "PENDING" ? "PENDING" : "PAID",
        subtotal,
        taxAmount,
        shippingAmount,
        totalAmount,
        createdAt,
        updatedAt: createdAt,
        items: {
          create: {
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            quantity,
            unitPrice,
            totalPrice: subtotal,
          },
        },
        statusHistory: {
          create: { status, note: "Order placed", createdAt },
        },
      },
    });

    await prisma.product.update({
      where: { id: product.id },
      data: { soldCount: { increment: quantity } },
    });

    void order;
  }

  console.log(`Seeded ${statuses.length} demo orders.`);
}

async function seedReviews(customers: { id: string }[]) {
  const existingCount = await prisma.review.count();
  if (existingCount > 0) {
    console.log(`Skipping review seed — ${existingCount} reviews already exist.`);
    return;
  }

  const products = await prisma.product.findMany({ take: 6 });
  if (products.length === 0 || customers.length === 0) return;

  const reviewTexts = [
    { rating: 5, title: "Absolutely stunning!", comment: "The zari work and finishing felt truly handwoven. Wore it for my daughter's wedding and got so many compliments." },
    { rating: 5, title: "Perfect fit and drape", comment: "Bought this for Gudi Padwa and the fit and drape were perfect. Delivery was quick and packaging felt premium." },
    { rating: 4, title: "Great quality", comment: "Authentic fabric, exactly as pictured. Customer support helped me pick the right blouse size over WhatsApp." },
    { rating: 5, title: "Worth every rupee", comment: "This is my third purchase from Anandi Sarees. Quality never disappoints." },
    { rating: 4, title: "Beautiful colors", comment: "The color was even richer in person than in the photos. Slight delay in delivery but worth the wait." },
  ];

  let i = 0;
  for (const product of products) {
    const review = reviewTexts[i % reviewTexts.length];
    const customer = customers[i % customers.length];
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: customer.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        status: "APPROVED",
        isFeatured: i < 2,
      },
    });
    i++;
  }

  console.log(`Seeded ${products.length} demo reviews.`);
}

async function seedCoupons() {
  const existingCount = await prisma.coupon.count();
  if (existingCount === 0) {
    await prisma.coupon.createMany({
      data: [
        {
          code: "WELCOME10",
          type: "PERCENTAGE",
          value: 10,
          minOrderAmount: 2999,
          maxDiscount: 1500,
          usageLimit: 500,
          isFestival: false,
          isActive: true,
        },
        {
          code: "GUDIPADWA25",
          type: "PERCENTAGE",
          value: 25,
          minOrderAmount: 4999,
          maxDiscount: 5000,
          usageLimit: 200,
          isFestival: true,
          isActive: true,
          startsAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
          code: "FLAT500",
          type: "FLAT",
          value: 500,
          minOrderAmount: 3999,
          usageLimit: 1000,
          isFestival: false,
          isActive: true,
        },
      ],
    });
    console.log("Seeded 3 demo coupons.");
  } else {
    console.log(`Skipping bulk coupon seed — ${existingCount} coupons already exist.`);
  }

  // Popup discount coupon — upserted independently since it's referenced by the
  // scroll-triggered popup and must always exist regardless of the check above.
  await prisma.coupon.upsert({
    where: { code: "WELCOME15" },
    update: {},
    create: {
      code: "WELCOME15",
      type: "PERCENTAGE",
      value: 15,
      minOrderAmount: 0,
      maxDiscount: 2000,
      usageLimit: undefined,
      isFestival: false,
      isActive: true,
    },
  });
  console.log("Ensured WELCOME15 popup coupon exists.");
}

async function seedBanners() {
  const existingCount = await prisma.banner.count();
  if (existingCount > 0) {
    console.log(`Skipping banner seed — ${existingCount} banners already exist.`);
    return;
  }

  await prisma.banner.createMany({
    data: [
      {
        title: "Gudi Padwa Special Collection",
        imageUrl: unsplash(IMG_YELLOW_CONTRAST, 1800),
        linkUrl: "/collection/gudi-padwa",
        placement: "HOMEPAGE_SLIDER",
        sortOrder: 1,
        isActive: true,
      },
      {
        title: "Festive Collection – Up to 25% Off",
        imageUrl: unsplash(IMG_GREEN_GOLD_SILK, 1800),
        linkUrl: "/collection/festive",
        placement: "FESTIVAL_BANNER",
        sortOrder: 2,
        isActive: true,
      },
      {
        title: "Bridal Paithani Edit",
        imageUrl: unsplash(IMG_BRIDAL_MAROON_GOLD, 1800),
        linkUrl: "/category/paithani",
        placement: "COLLECTION_BANNER",
        sortOrder: 3,
        isActive: true,
      },
    ],
  });

  console.log("Seeded 3 demo banners.");
}

async function seedTestimonialsAndBlog() {
  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    await prisma.testimonial.createMany({
      data: [
        { name: "Anjali Deshmukh", location: "Pune, Maharashtra", rating: 5, message: "The Yeola Paithani I ordered for my daughter's wedding was beyond beautiful.", isFeatured: true },
        { name: "Snehal Patil", location: "Nashik, Maharashtra", rating: 5, message: "Bought a Nauvari for Gudi Padwa and the fit and drape were perfect.", isFeatured: true },
        { name: "Radhika Kulkarni", location: "Mumbai, Maharashtra", rating: 5, message: "Authentic Solapuri cotton sarees, exactly as pictured.", isFeatured: false },
      ],
    });
    console.log("Seeded 3 testimonials.");
  }

  const existingPosts = await prisma.blogPost.count();
  if (existingPosts === 0) {
    await prisma.blogPost.create({
      data: {
        title: "The Art of Paithani: A Weaver's Journey from Yeola",
        slug: "art-of-paithani-yeola-weavers",
        excerpt: "Discover how Yeola's master weavers create every Paithani saree by hand, thread by thread.",
        contentHtml: "<p>Every Paithani saree begins its journey on a traditional handloom in Yeola, Maharashtra...</p>",
        coverImageUrl: unsplash(IMG_STREET_GROUP, 1200),
        categoryName: "Craftsmanship",
        tags: "paithani,handloom,yeola",
        isPublished: true,
        publishedAt: new Date(),
      },
    });
    console.log("Seeded 1 blog post.");
  }
}

async function main() {
  await seedCategories();
  await seedOccasions();
  await seedLandingPages();
  await seedSuperAdmin();
  await seedProducts();
  const customers = await seedCustomers();
  await seedOrders(customers as { id: string; addresses: { id: string }[] }[]);
  await seedReviews(customers as { id: string }[]);
  await seedCoupons();
  await seedBanners();
  await seedTestimonialsAndBlog();
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
