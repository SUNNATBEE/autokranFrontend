# Project workflow & repo map (READ FIRST)

This product ("AUTOKRAN.UZ" crane-rental site) is split across **two separate
GitHub repositories**. This file exists so context is never lost between work
sessions — always read it before making changes.

| Part         | Repository                                            | Local folder | Deploy   |
| ------------ | ----------------------------------------------------- | ------------ | -------- |
| **Frontend** | https://github.com/SUNNATBEE/autokranFrontend         | `frontend/`  | Vercel   |
| **Backend**  | https://github.com/SUNNATBEE/autokran                 | `backend/`   | Railway  |

> **This repo is the FRONTEND** (Next.js 16 App Router, next-intl, Tailwind v4).

## Golden rule for pushing

- **Frontend changes** (anything under `frontend/`) → push to **`autokranFrontend`** (this repo).
- **Backend changes** (anything under `backend/`) → push to **`autokran`**.
- Never mix: one change set goes to exactly one repo.

The two folders live side by side locally at `…/crane-rental-app/`, but each is
its own independent git repo with its own remote.

## Shared contract (keep in sync across both repos)

Because the apps are separate, a few things MUST stay aligned manually:

- **`JWT_SECRET`** — must be the **same value** in the frontend and the backend.
  This app's `src/proxy.ts` verifies the admin JWT the backend signs.
- **`admin-auth-config.ts`** — exists in **both** repos (roles + path rules). If
  you change it here, mirror the change in the backend repo.
- **API contract** — request/response shapes of `/api/*` endpoints. The frontend
  proxies `/api/*` and `/uploads/*` to `BACKEND_URL`.

## This frontend at a glance

- Stack: Next.js **16.2.2** (App Router), next-intl (uz/ru/en, default uz),
  Tailwind v4 + daisyUI, framer-motion.
- Next 16 uses **`src/proxy.ts`** (NOT `middleware.ts`).
- Before writing Next.js code, read the bundled guides in
  `node_modules/next/dist/docs/` — APIs differ from older Next (see `AGENTS.md`).
- Env (`.env.local`, git-ignored): `BACKEND_URL`, `JWT_SECRET` (must match
  backend), `NEXT_PUBLIC_SITE_URL` (drives SEO: sitemap/robots/canonical/OG/JSON-LD).
- Deploy on Vercel: set the same env vars in the Vercel dashboard.

See [`README.md`](./README.md) for details.
