# AutoDeal — Car Dealership Platform

A full-stack car dealership web app with a public storefront, admin panel, car inventory management, and email contact form.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/car-dealership run dev` — run the frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed admin user + sample cars
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)
- Required env: `SESSION_SECRET` — JWT secret for admin auth

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter routing + Tailwind CSS
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: JWT (jsonwebtoken) + bcrypt password hashing
- Email: Nodemailer (Ethereal test account in dev; configure SMTP_HOST/USER/PASS for prod)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/db/src/schema/` — Drizzle schema: `cars.ts`, `admins.ts`
- `artifacts/api-server/src/routes/` — Route handlers: `auth.ts`, `cars.ts`, `contact.ts`
- `artifacts/car-dealership/src/` — React frontend
- `scripts/src/seed.ts` — Database seed script

## Architecture decisions

- JWT stored in localStorage as "adminToken"; `setAuthTokenGetter` in custom-fetch automatically attaches it as Bearer token to admin API calls.
- Car `images` column stored as comma-separated URLs in a single `text` field; serialized to/from `string[]` in the API layer.
- Car `price` uses Drizzle `numeric` column (stored as string, serialized to `number` in responses).
- Contact email uses Ethereal test accounts in development; set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT` env vars for real sending.
- Staff contact email defaults to `aabuashour3@gmail.com`; override with `STAFF_EMAIL` env var.

## Product

- **Public site**: Cinematic homepage with featured cars, full inventory page with brand/availability filters, car detail page with image gallery, and contact form.
- **Admin panel** (`/admin/login`): Secure JWT login (username: `admin`, password: `admin123`). Admin can add, edit, and delete cars. Dashboard shows inventory stats.

## Gotchas

- Restart api-server workflow after any backend code change.
- Re-run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change.
- bcrypt requires native bindings — listed in `onlyBuiltDependencies` in `pnpm-workspace.yaml`.
- `pnpm --filter @workspace/db run push-force` if schema push fails with column conflicts.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
