# Mumu Ice — independent website concept

A responsive React, TypeScript and Vite concept built with the supplied Mumu Ice artwork. It is an independent portfolio project, not an official Mumu Ice website.

The homepage presents the brand. `/order`, `/delivery`, `/business` and `/contact` demonstrate customer journeys. Forms keep values in memory only and show local previews; they do not send requests, place orders, quote prices or schedule delivery.

## Run locally

```bash
npm install
npm run dev
```

Open the address printed by Vite. Run `npm run build` to check the production bundle, then `npm run preview` to serve it locally.

## Browser checks

With the dev server running at `http://127.0.0.1:4173/`:

```bash
npm run verify:journeys
```

This checks the order, delivery, business and contact flows; validation and reset; direct route loading and refresh; reduced motion; and horizontal overflow at 360px, 390px, 768px and 1440px. It requires Chrome at the path in `scripts/verify-journeys.mjs`. To check the published site, set `MUMU_VERIFY_URL=https://mumu-ice-concept.pages.dev` before running the command.

The original artwork is preserved in `Mumu_Ice_Concept_Assets/`. Optimized WebP derivatives are in `public/images/`. Rebuild them with `python scripts/optimize-images.py` (requires Pillow).

## Hosting status

The interactive concept is live at **https://mumu-ice-concept.pages.dev/** via Cloudflare Pages Direct Upload. GitHub pushes do not automatically update the Cloudflare Pages site; a future release requires another Pages deployment.
