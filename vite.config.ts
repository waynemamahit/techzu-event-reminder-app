import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const manifestIcons = [
    {
        src: '/icons/icon-64x64.png',
        sizes: '64x64',
        type: 'image/png',
    },
    {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
    },
    {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
    },
    {
        src: '/icons/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
    },
];

// Define the icons in the Laravel public folder that:
// 1. we don't need in the webmanifest, BUT
// 2. we still want the service worker to pre-cache for offline use
// The src is a web URL relative the public dir.
const publicIcons = [
    { src: '/favicon.ico' },
    { src: '/favicon.svg' },
    { src: '/icons/apple-touch-icon-180x180.png' },
];

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            // Make the PWA plugin build to the same place as laravel/vite-plugin
            buildBase: '/build/',
            outDir: 'public/build',

            // Use 'prompt' for new versions of the PWA. 'autoUpdate' is
            // simpler but may as well dmeo how this works.
            registerType: 'autoUpdate',

            // Do not use the PWA with dev builds.
            devOptions: {
                enabled: false,
            },

            workbox: {
                // Add all the assets built by Vite into the public/build/assets
                // folder to the SW cache.
                globPatterns: [
                    '**/*.{js,css,html,ico,jpg,png,svg,woff,woff2,ttf,eot}',
                ],

                navigateFallback: '/',

                // Add some explicit URLs to the SW precache. This helps us
                // work with the laravel/vite-plugin setup.
                additionalManifestEntries: [
                    // Cache the root URL to get hold of the PWA HTML entrypoint
                    // defined in welcome.blade.php. Ref:
                    // https://github.com/vite-pwa/vite-plugin-pwa/issues/431#issuecomment-1703151065
                    { url: '/', revision: `${Date.now()}` },

                    // Cache the icons defined above for the manifest
                    ...manifestIcons.map((i) => {
                        return { url: i.src, revision: `${Date.now()}` };
                    }),

                    // Cache the other offline icons defined above
                    ...publicIcons.map((i) => {
                        return { url: i.src, revision: `${Date.now()}` };
                    }),
                ],

                // Ensure the JS build does not get dropped from the cache.
                // This allows it to be as big as 5MB
                maximumFileSizeToCacheInBytes: 5000000,
            },

            // Manifest settings - these will appear in the generated manifest.webmanifest
            manifest: {
                // Metadata
                name: 'Techzu Event Reminder App',
                short_name: 'techzu-event-reminder-app',
                description: 'Event Reminder App from Techzu',
                theme_color: '#FFFFFF',
                background_color: '#FFFFFF',
                orientation: 'portrait',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                // These icons are used when installing the PWA onto a home screen
                icons: manifestIcons,
            },
        }),
    ],
});
