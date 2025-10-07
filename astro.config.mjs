// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';


import sitemap from '@astrojs/sitemap';


export default defineConfig({
  vite: {
    plugins: [tailwindcss(),]
  },

  site: "https://prabinsubedi.tech",
  integrations: [mdx(), sitemap()],
  output: 'static',
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },


    imageService: "cloudflare"
  })
});