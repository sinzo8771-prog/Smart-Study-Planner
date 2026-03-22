import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Enable instrumentation for automatic migrations
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
