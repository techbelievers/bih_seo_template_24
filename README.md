# Luxe Estate — Luxury Real Estate Template (BIH Template 24)

A luxury, minimal, modern single-property template for Buy India Homes.
React 18 + Vite 6 + Tailwind CSS v4, driven entirely by the existing
`buyindiahomes.in` APIs — no backend changes required.

## Design language

- **Palette**: warm obsidian (`ink`), ivory/cream surfaces, champagne gold accents
- **Typography**: Playfair Display (display serif) + Manrope (UI) — self-hosted
  variable fonts, zero render-blocking font requests
- **Depth ("3D")**: layered shadows, glass panels, perspective tilt on hover,
  scroll reveals — pure CSS transforms, no 3D libraries
- Design tokens live in `src/index.css` under `@theme`

## Architecture

```
src/
  lib/api.js            # cached fetch — each endpoint hits the network once
  lib/phone.js          # phone sanitising + WhatsApp deep links
  hooks/useApi.js       # subscribe a component to a cached endpoint
  hooks/useInView.js    # IntersectionObserver (reveals + lazy mounting)
  hooks/useEnquiry.js   # opens the single shared enquiry dialog
  context/EnquiryContext.jsx
  components/ui/        # Reveal, LazySection, Img, SectionHeading
  components/           # one component per section
  pages/                # HomePage, BlogPost, ThankYou, PrivacyPolicy
```

## Performance decisions (keep these when editing)

- **Hero = LCP**: first hero frame is `loading=eager` + `fetchpriority=high`;
  `/header` + `/footer` are prefetched in `lib/api.js` before React mounts;
  `index.html` preconnects to both API/image origins.
- **Everything below Overview is lazy-mounted** via `LazySection` — sections
  render (and fetch) only when the visitor nears them. Anchor ids live on the
  always-mounted wrappers; `HashScrollFix` in `App.jsx` re-aligns deep links.
- **All images**: lazy + async decode + aspect-ratio boxes (zero CLS) through
  `components/ui/Img.jsx`.
- **YouTube facade**: thumbnail only until clicked. **Google Map**: iframe
  injected only near viewport.
- **Route splitting**: blog/thank-you/privacy are separate chunks.

## SEO

- **Build-time prerender** (`scripts/prerender.mjs`, runs inside `npm run
  build`): renders the app in headless Chromium against the live API and
  overwrites `dist/index.html` with the complete HTML — crawlers get the
  full page without executing JS. The captured API payloads are inlined as
  `window.__PRELOADED_API__`; on load the app paints instantly from them,
  then revalidates each endpoint once in the background (`src/lib/api.js`)
  so CMS edits between deploys still reach users.
  - Fail-soft: if no browser/API is available the build still succeeds and
    ships the client-rendered `index.html`.
  - CI needs `npx playwright install --with-deps chromium` (already in the
    workflow). Rebuild + redeploy to refresh the crawler-visible content.
- Build-time meta/OG/canonical/JSON-LD injected into `index.html` from
  `seodata.json` (vite-plugin-html) — unchanged deploy contract.
- `FAQPage` JSON-LD auto-generated from the `/faq` API (rich results).
- `BlogPosting` JSON-LD + per-post meta on blog pages.
- Semantic HTML: one `h1` (hero), sections with proper heading order,
  descriptive alt text, `noindex` on thank-you/privacy.

## Commands

```bash
npm run dev       # local dev (uses config.js fallback slug)
npm run build     # production build (reads seodata.json for meta injection)
npm run preview   # serve the production build
npm run lint      # eslint
```

`VITE_SLUG_URL` / `VITE_API_URL` env vars override `config.js`.

> The previous template is preserved in `_original_template_backup/`.
