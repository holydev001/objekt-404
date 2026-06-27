# OBJEKT//404 — Uncatalogued Artifacts

An interactive 3D artifact showcase. Browse a small catalogue of recovered "artifacts" (3D models) rendered in real time, with hero copy, dossier stats, and accent colors that retune per artifact.

> Live preview: https://objekt-404.vercel.app

## Stack

- **Framework**: [TanStack Start v1](https://tanstack.com/start) (React 19, file-based routing)
- **Build**: Vite 7, deployed to Cloudflare Workers
- **Styling**: Tailwind CSS v4 (native `@import` + `@theme` tokens in `src/styles.css`)
- **3D**: [three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Animation**: GSAP + ScrollTrigger
- **Backend**: None — fully static client app

## Getting started

```bash
pnpm install
pnpm run dev
```

The app runs on `http://localhost:8080`.

```bash
pnpm run build   # production build
```

## Project layout

```
public/models/          GLB artifact models served as static files
src/assets/models/      CDN-hosted model references (.asset.json)
src/components/
  Scene.tsx             R3F canvas, GLB loader, auto-fit, error boundary
  Cursor.tsx            Custom futuristic reticle cursor
src/lib/artifacts.ts    Artifact registry — single source of truth
src/routes/
  __root.tsx            App shell, fonts, SEO/OG metadata
  index.tsx             Home page (hero, dossier, catalogue, transmit)
src/styles.css          Tailwind v4 theme tokens + utilities
```

## Adding a new artifact

1. Drop the model into `public/models/your_model.glb` (1K textures recommended).
2. Append an entry to `ARTIFACTS` in `src/lib/artifacts.ts` with metadata, accent colors, dossier stats, and `fitSize` for framing.
3. That's it — the hero, dossier, catalogue, and accent theme all rebind automatically.

Keep models small: aim for **< 5 MB**, 1K textures, Draco-compressed where possible.

## Performance notes

- Models other than the active one preload during browser idle (`requestIdleCallback`).
- Canvas uses `dpr: [1, 1.5]`, `high-performance` GL, and a single-frame baked contact shadow.
- Only the `<Model>` re-suspends on artifact swap — the WebGL context, lights, and environment persist.

## License

Private / unlicensed. All artifact models belong to their respective authors.
