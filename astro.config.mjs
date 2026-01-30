import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://mysite.com",
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
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