import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not set a custom CSP here - Next.js Turbopack (dev) manages it internally.
  // A custom CSP conflicts with Next.js's own unsafe-eval requirements in development.
};

export default nextConfig;
