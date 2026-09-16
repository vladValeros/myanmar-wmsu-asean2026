# Myanmar — ASEAN Week 2026 (WMSU)

A Progressive Web App built for the Myanmar booth at WMSU's ASEAN Week 2026.
The centerpiece is the Shwedagon Pagoda, presented through animated content
sections and an AR feature (via `<model-viewer>`) that lets visitors view and
place a 3D model of the pagoda in their own space using their phone camera.

## Deployment

Deployed on Vercel at **myanmar-wmsu-asean2026.vercel.app**.

## Status

This is Phase 0: project scaffolding only. No content, styling, animation,
or AR wiring has been added yet.

## Tech stack

- [Vite](https://vitejs.dev/) (vanilla TypeScript template)
- [`@google/model-viewer`](https://modelviewer.dev/) for the AR pagoda feature
- [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) for PWA support (manifest, service worker)

## Project structure

```
src/                       application source (TypeScript)
public/assets/models/      3D model assets
public/assets/images/      image assets
public/icons/              PWA icons and favicon
```

## Asset naming convention

To keep asset references predictable as content is added, use these exact
names:

**`public/assets/models/`**
- `shwedagon-pagoda.glb` — model for Android/Chrome (Scene Viewer)
- `shwedagon-pagoda.usdz` — model for iOS/Safari (Quick Look)

**`public/assets/images/`**
- `logo-phicss.svg`
- `logo-ccs.svg`
- `logo-architecture.svg`
- any additional images: `lowercase-hyphenated-name.ext`

**`public/icons/`**
- `icon-192.png`
- `icon-512.png`
- `icon-512-maskable.png`
- `favicon.svg`

## Development

```bash
npm install
npm run dev
```
