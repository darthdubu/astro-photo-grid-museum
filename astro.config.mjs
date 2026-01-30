import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://mysite.com",
  output: "server",
  adapter: vercel(),
  devToolbar: {
    enabled: false,
  },
  integrations: [sitemap(), react()],
  prefetch: true,
  vite: {
    ssr: {
      noExternal: ["smartypants"],
    },

    plugins: [tailwindcss()],
  },
});