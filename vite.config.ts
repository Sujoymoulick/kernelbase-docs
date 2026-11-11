import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { ALL_DOC_PAGES } from './src/data/pages';
import { writeSitemapAndRobots } from './src/utils/sitemapGenerator';

function sitemapPlugin(): Plugin {
  return {
    name: 'generate-sitemap-and-robots',
    buildStart() {
      try {
        writeSitemapAndRobots(ALL_DOC_PAGES);
      } catch (err) {
        console.warn('[sitemap-plugin] Generation warning:', err);
      }
    },
  };
}

// Installer binaries in public/downloads are for the dev server only; production
// links point at the GitHub Release, so keep them out of dist.
function stripInstallersPlugin(): Plugin {
  return {
    name: 'strip-installer-binaries',
    apply: 'build',
    closeBundle() {
      const dir = path.resolve(__dirname, 'dist/downloads');
      if (!fs.existsSync(dir)) return;
      for (const f of fs.readdirSync(dir)) {
        if (/\.(dmg|tar\.gz|exe)$/.test(f)) fs.rmSync(path.join(dir, f));
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), sitemapPlugin(), stripInstallersPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
