// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';


export default defineConfig({
  vite: {
    plugins: [tailwindcss(),]
  },

  integrations: [mdx()],
  output: 'static',
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },


    imageService: "cloudflare"
  })
});