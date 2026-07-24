import { resolve } from 'node:path';

/**
 * Library build (npm package). Bundles `src/index.ts` into an ESM module plus
 * a single CSS file, emitted to `lib/`. Type declarations are generated
 * separately by `tsc -p tsconfig.lib.json`.
 *
 * Run via: `npm run build:lib`.
 */
export default {
  // Don't copy the demo's public/ assets (favicon, og-image) into the package.
  publicDir: false,
  build: {
    outDir: 'lib',
    emptyOutDir: true,
    lib: {
      entry: resolve('src/index.ts'),
      name: 'PageOnMobile',
      formats: ['es' as const],
      fileName: () => 'pageonmobile.js',
      cssFileName: 'pageonmobile',
    },
  },
};
