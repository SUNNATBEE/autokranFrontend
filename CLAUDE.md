# CLAUDE.md — Frontend (AUTOKRAN.UZ)

Project context for Claude Code / any agent working in this repo. Read this
**first**, then [`AGENTS.md`](./AGENTS.md) and [`WORKFLOW.md`](./WORKFLOW.md).

---

## 1. What this is

The public website + admin panel UI for **AUTOKRAN.UZ** — a crane-rental
(avtokran ijara) company in Uzbekistan. This repo is the **frontend only**:
Next.js 16 (App Router), multilingual (uz/ru/en). All dynamic data comes from a
separate Express API.

### ⚠️ This is NOT the Next.js you know (Next 16)

Next.js 16 has breaking changes vs older versions. **Before writing Next.js
code, read the relevant guide in `node_modules/next/dist/docs/`.** Heed
deprecation notices. Most important difference here: routing middleware lives in
**`src/proxy.ts`**, not `middleware.ts` (the `middleware` convention is
deprecated in 16).

### Two-repo architecture (CRITICAL)

| Part         | Repo                                              | Folder      | Host    |
| ------------ | ------------------------------------------------- | ----------- | ------- |
| **Frontend** | https://github.com/SUNNATBEE/autokranFrontend (this) | `frontend/` | Vercel  |
| **Backend**  | https://github.com/SUNNATBEE/autokran             | `backend/`  | Railway |

> **Push rule:** frontend changes → `autokranFrontend` (this repo); backend
> changes → `autokran`. Never mix. The folders sit side by side locally but are
> independent git repos with separate remotes.

---

## 2. Status

- ✅ Deployed on **Vercel**, build green, all routes prerendered.
- Public pages are **server-rendered / SSG** (great for SEO).
- Connects to the backend through Next rewrites (`BACKEND_URL`).

---

## 3. Tech stack

- **Next.js 16.2.2** (App Router, Turbopack), React 19.
- **next-intl 4** — locales `uz` (default), `ru`, `en`; messages in `messages/*.json`.
- **Tailwind CSS v4** + **daisyUI 5**; `framer-motion` for animation;
  `lucide-react` icons; `react-hook-form`, `react-hot-toast`.
- `jose` for JWT verification in the proxy.

---

## 4. Routing, i18n & file map

```
src/
  proxy.ts                       # Next 16 proxy (was middleware): locale routing + admin auth guard
  i18n/{routing,request}.ts      # next-intl config (locales, default uz)
  middleware? NO — use proxy.ts
  app/
    [locale]/
      layout.tsx                 # generateMetadata (localized SEO), viewport, theme no-flash script
      page.tsx                   # home (SERVER component) + LocalBusiness JSON-LD
      loading.tsx / error.tsx / not-found.tsx
    admin/*                      # role-based admin panel (opened via footer login modal)
    sitemap.ts / robots.ts / manifest.ts   # SEO route handlers (app root, not [locale])
    globals.css                  # theme tokens, fonts, component classes
  components/                    # Navbar, Footer, sections/*, modals, admin/*
  constants/index.ts            # craneData, companyInfo, siteConfig (SITE_URL, geo, OG)
  lib/admin-auth-config.ts      # AdminRole + route rules  (MIRRORED in backend repo)
messages/{uz,ru,en}.json        # all UI + SEO copy
```

Locale routing: `/` → `/uz` (default). Matcher in `proxy.ts` covers `/`,
`/(uz|ru|en)/:path*`, `/admin/:path*`.

---

## 5. SEO (already implemented)

- **Server-rendered home page** (was previously `"use client"` — now a Server
  Component so crawlers see real content).
- Per-locale `generateMetadata`: title/description/keywords from `messages.*.Seo`,
  `metadataBase`, canonical, **hreflang `alternates`** (uz/ru/en + x-default),
  Open Graph + Twitter cards.
- `sitemap.ts` (with hreflang), `robots.ts` (disallow `/admin`,`/api`),
  `manifest.ts`, app icons, theme-color via `generateViewport`.
- **`LocalBusiness` JSON-LD** in `page.tsx` (address, geo, hours, phone, socials).
- Driven by **`NEXT_PUBLIC_SITE_URL`** (canonical/OG/sitemap base).

When changing copy, update all three `messages/*.json` files (incl. the `Seo`
namespace).

---

## 6. Performance (already implemented)

- All images use **`next/image`** (AVIF/WebP, lazy, priority on hero/first cards);
  crane images are **local** (`public/images/*`), not hotlinked.
- Font fix: `globals.css` body uses the loaded Inter/Montserrat vars (an earlier
  bug overrode them with Arial — don't reintroduce it).
- **No theme flash (FOUC):** an inline script in `layout.tsx` sets `data-theme`
  before paint; `<html suppressHydrationWarning>`.
- `next.config.ts`: `images.qualities` (required in Next 16), `remotePatterns`,
  security headers, `poweredByHeader:false`.

---

## 7. Backend integration

- Next rewrites (in `next.config.ts`) proxy `/api/*` and `/uploads/*` to
  **`BACKEND_URL`** (server-side), so the browser stays same-origin and the
  `admin_token` cookie is first-party.
- `src/proxy.ts` guards `/admin/*`: verifies the backend-signed JWT with
  **`JWT_SECRET`** (must match the backend). It **fails closed** (redirect to
  login) and — importantly — **does not crash the public site** if the secret is
  missing (it only warns). Don't reintroduce a throw-on-missing-secret here.

---

## 8. Environment variables

| Variable               | Required | Notes                                                       |
| ---------------------- | -------- | ----------------------------------------------------------- |
| `BACKEND_URL`          | prod     | Railway backend public URL (no trailing slash, no `/api`)   |
| `JWT_SECRET`           | prod     | **must match the backend**                                  |
| `NEXT_PUBLIC_SITE_URL` | prod     | public canonical URL; drives SEO. Build-time inlined.       |

`BACKEND_URL` and `NEXT_PUBLIC_SITE_URL` are read at **build time** → after
changing them on Vercel you must **redeploy**.

---

## 9. Local development

```bash
npm install
cp .env.example .env.local   # fill values
npm run dev                  # http://localhost:3000
```

The backend must be running at `BACKEND_URL` (default `http://localhost:4000`).
Scripts: `dev`, `build` (`next build`), `start`, `lint`.

---

## 10. Deployment (Vercel)

- Repo root **is** the frontend → Vercel Root Directory `/`.
- Set `BACKEND_URL`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL` in Project → Settings →
  Environment Variables (Production), then redeploy.
- Public site works even before `BACKEND_URL` is set (content is in code); forms
  and admin need the backend wired up.

---

## 11. Known debt / gotchas

- Admin panel pages (`src/app/admin/*`) have pre-existing lint findings
  (`react-hooks/set-state-in-effect`, `no-explicit-any`) — non-blocking.
- `admin-auth-config.ts` is duplicated in the backend repo — keep both in sync.
- Don't switch `proxy.ts` back to `middleware.ts` (deprecated in Next 16).

---

## 12. Cross-repo contract (keep in sync with the backend)

- **`JWT_SECRET`** — identical value on both apps.
- **`admin-auth-config.ts`** — mirror any change to the backend repo.
- **API shapes** of `/api/*` — coordinate with the backend.
