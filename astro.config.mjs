// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({

  vite: {
    plugins: [tailwindcss()]
  },
  output: 'static',
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },


    imageService: "cloudflare"
  })
});