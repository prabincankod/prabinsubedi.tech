// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';


import sitemap from '@astrojs/sitemap';


export default defineConfig({
  vite: {
    plugins: [tailwindcss(),]
  },

  site: "https://prabin.is-a.dev",
  integrations: [mdx(), sitemap()],
  output: 'static',

});