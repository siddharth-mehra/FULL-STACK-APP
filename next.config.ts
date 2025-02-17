import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next.config.js
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during production builds
  },
};

module.exports = nextConfig;
