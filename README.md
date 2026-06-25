# AUTOKRAN.UZ — Frontend (Next.js 16)

UI-only Next.js App Router app for the AUTOKRAN.UZ crane-rental site. All data
comes from the standalone Express API.

> **Two-repo project.** This is the **frontend**. The backend (Express + MongoDB)
> lives in a separate repo: <https://github.com/SUNNATBEE/autokran>.
> Read [`WORKFLOW.md`](./WORKFLOW.md) first — it documents the repo map and the
> push rules.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

The backend must be running on the URL set in `BACKEND_URL` (default
`http://localhost:4000`). Next.js rewrites proxy `/api/*` and `/uploads/*`
to the backend, so browser requests stay same-origin and auth cookies work.

`JWT_SECRET` **must match** the backend's `JWT_SECRET` so the admin proxy can
verify the token the backend issues. `NEXT_PUBLIC_SITE_URL` drives SEO output
(sitemap, robots, canonical, Open Graph, JSON-LD).

## Deploy

Vercel — set `BACKEND_URL`, `JWT_SECRET` (same as backend) and
`NEXT_PUBLIC_SITE_URL` in the Vercel project env. The repo root is the frontend,
so the Vercel Root Directory is `/`.

## Structure

- `src/app/[locale]/*` — public site (uz/ru/en), server-rendered
- `src/app/admin/*` — role-based admin panel (opened via the footer login modal)
- `src/app/{sitemap,robots,manifest}.ts` — SEO route handlers
- `src/components/*` — UI components
- `src/i18n`, `messages/*` — next-intl localization
- `src/proxy.ts` — locale routing + admin auth guard (Next 16 proxy convention)
