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

async function main() {
  await seedCategories();
  await seedOccasions();
  await seedLandingPages();
  await seedSuperAdmin();
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
