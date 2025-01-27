import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint during the build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
