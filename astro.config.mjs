import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { validateBuildEnv } from './src/lib/env';

const siteUrl = validateBuildEnv();

export default defineConfig({
  output: 'static',
  site: siteUrl,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
