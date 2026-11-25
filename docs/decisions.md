pamka# Architectural Decisions

## 1. Astro Static Output
- Chosen for fast First Contentful Paint / LCP (< 2.5s on 4G) and minimal client JavaScript.
- React islands are omitted unless strictly needed for complex stateful UI.

## 2. Tailwind CSS via `@tailwindcss/vite`
- Zero-runtime utility CSS bundled during Astro build.
- Mobile-first baseline starting at `360px` viewport width with `44px` minimum interactive targets.

## 3. Centralized Configuration (`src/config/site.config.ts`)
- All client-editable text, prices, media paths, WhatsApp numbers, and feature flags (`requireConsent`, `checkout.enabled`) live in one typed file.

## 4. Tracking & Deduplication (`src/lib/tracking.ts` + `api/tiktok-events.ts`)
- Both client-side TikTok Pixel (`ttq`) and server-side TikTok Events API receive the same `event_id` generated via `crypto.randomUUID()` for deduplication (T-05).
- GA4 runs alongside TikTok Pixel as a comparison channel (T-03).
- `TIKTOK_ACCESS_TOKEN` and `TIKTOK_PIXEL_ID` for server calls are read only from server environment variables.
