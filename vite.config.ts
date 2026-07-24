import { cp } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Copy the root-level `media/` folder into the build output. In dev, Vite
 * already serves `/media/*` straight from the project root, so this only
 * runs for `vite build`.
 */
function copyMedia(): Plugin {
  return {
    name: 'copy-media',
    apply: 'build',
    async closeBundle() {
      await cp(resolve('media'), resolve('dist/media'), { recursive: true });
    },
  };
}

export default {
  // Served from https://exphoenee.github.io/pageonmobile/ (GitHub Pages
  // project site), so assets must resolve under that sub-path.
  base: '/pageonmobile/',
  plugins: [copyMedia()],
};
