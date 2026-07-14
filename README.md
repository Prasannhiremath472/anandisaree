# Anandi Saree

Premium e-commerce platform for authentic Maharashtrian sarees (Paithani, Nauvari,
Narayan Peth, Solapuri, Khun and more) alongside curated premium Indian saree collections.

Monorepo with npm workspaces:

- `frontend/` — Customer-facing storefront (React 19 + Vite + TypeScript + Tailwind)
- `admin/` — Admin panel (React 19 + Vite + TypeScript + Tailwind)
- `backend/` — REST API (Node.js + Express + Prisma + MySQL)
- `packages/shared/` — Shared TypeScript types and catalog domain constants

## Prerequisites

- Node.js 20+
- A running MySQL 8 instance

## Setup

```bash
npm install
cp backend/.env.example backend/.env   # then fill in DATABASE_URL and secrets
npm run build:shared
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Development

```bash
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:5173
npm run dev:admin      # http://localhost:5174
```

The seed script creates a Super Admin account using `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` from `backend/.env` (defaults to
`admin@anandisaree.com` / `ChangeMe123!` — change this before deploying).

## Project status

**Phase 1 (complete):** project architecture, folder structure, MySQL/Prisma schema,
JWT authentication (register/login/OTP/refresh tokens), shared domain constants, and
base layouts/shells for the storefront and admin panel.

Subsequent phases (frontend UI, backend APIs, admin panel features, payments, SEO,
testing, deployment) are built incrementally — see project conversation history for
the phase plan.
