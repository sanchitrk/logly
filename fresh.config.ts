import { defineConfig } from "$fresh/server.ts";

export default defineConfig({
  router: {
    trailingSlash: true,
  },
});
