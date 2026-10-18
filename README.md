# Mumu Ice — independent website concept

A responsive, single-page portfolio concept built with React, TypeScript, and Vite. It uses the supplied concept artwork and keeps all visible copy as HTML. This is not an official Mumu Ice website or an ordering system.

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite. To check the production bundle, run `npm run build` and `npm run preview`.

## Assets

The original files are preserved in `Mumu_Ice_Concept_Assets/`. Optimized responsive WebP derivatives are in `public/images/`. Rebuild them with `python scripts/optimize-images.py` (requires Pillow). The desktop and mobile heroes use separate responsive sources, and lower-page imagery loads lazily.

The header, footer, and favicon share a clean local SVG cube mark based on the supplied navy logo reference. The packaging and lifestyle artwork are concept images.

## Browser review

`npm run verify` checks 360px, 390px, 768px, and 1440px in local Chrome while the Vite server is running at `http://127.0.0.1:4173/`. It checks overflow, image loading, navigation, mobile menu, keyboard entry, and reduced motion. It writes full-page screenshots to `desktop-full.png` and `mobile-full.png`, plus first-screen captures at 360px and 768px. Chrome must be installed at the path used in `scripts/verify.mjs`.

## Cloudflare handoff

The static `dist/` folder is ready for Cloudflare Pages. Use `npm run build` as the build command and `dist` as the output directory. No Cloudflare deployment has been made.

Independent website and branding concept. Not affiliated with Mumu Ice.
