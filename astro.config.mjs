import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mysite.com",
  output: "server",
  adapter: vercel({
    includeFiles: ["./images.json"],
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
