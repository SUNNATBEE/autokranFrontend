# Crane Rental — Frontend (Next.js)

UI-only Next.js App Router app. All data comes from the standalone
[`backend`](../backend) Express API.

## Setup

```bash
cd frontend
npm install
npm run dev    # http://localhost:3000
```

The backend must be running on the URL set in `BACKEND_URL` (default
`http://localhost:4000`). Next.js rewrites proxy `/api/*` and `/uploads/*`
to the backend, so browser requests stay same-origin and auth cookies work.

`JWT_SECRET` **must match** the backend's `JWT_SECRET` so the admin
middleware can verify the token the backend issues.

## Structure

- `src/app/[locale]/*` — public site (uz/ru/en)
- `src/app/admin/*` — role-based admin panel (opened via the footer login modal)
- `src/components/*` — UI components
- `src/i18n`, `messages/*` — next-intl localization
- `src/middleware.ts` — locale routing + admin auth guard
