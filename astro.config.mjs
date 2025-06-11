// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [
    react(),
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  server: { port: 3000 },
  vite: {
    envPrefix: "PUBLIC_",
  },
});
