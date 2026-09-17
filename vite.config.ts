import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Shwedagon Pagoda — WMSU ASEAN 2026',
        short_name: 'Shwedagon',
        description:
          "An interactive 3D tour of Myanmar's Shwedagon Pagoda for WMSU ASEAN Week 2026.",
        theme_color: '#EA2839',
        background_color: '#8B6914',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the app shell + every static asset (JS/CSS/HTML/fonts/
        // icons) so the site works fully offline after a first visit.
        // Deliberately excludes .glb/.usdz — see runtimeCaching below.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // assets/images/ holds the partner logo files shown in the credits
        // section. At 3.8MB combined they're not worth forcing into every
        // visitor's install-time precache for a strip of small logos —
        // excluded here deliberately, same reasoning as the AR models below.
        // The browser's normal HTTP cache still picks them up after a
        // visitor actually views the credits section.
        globIgnores: ['assets/images/**'],
        runtimeCaching: [
          {
            // The AR model files are large (1.7MB / 17.6MB) and only ever
            // needed by visitors who scroll to the AR section. Rather than
            // forcing every visitor to download ~19MB on install, cache
            // them opportunistically the first time they're actually
            // fetched, so a repeat visit to the AR section doesn't
            // re-download them.
            urlPattern: /\.(?:glb|usdz)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ar-models',
              expiration: {
                maxEntries: 4,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
