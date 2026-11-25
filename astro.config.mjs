import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { validateBuildEnv } from './src/lib/env';
import { validateSiteConfig } from './src/lib/validate-config';

const siteUrl = validateBuildEnv();
validateSiteConfig();

export default defineConfig({
  output: 'static',
  site: siteUrl,
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/terima-kasih/') && !page.endsWith('/404/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
