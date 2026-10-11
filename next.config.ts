import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is off for the Phase 1 demo: every page is static content plus
  // client-side interactivity. Revisit when Phase 2 adds server data (see docs/PHASE2.md).
  cacheComponents: false,
  images: {
    formats: ["image/webp"],
    qualities: [70, 75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
