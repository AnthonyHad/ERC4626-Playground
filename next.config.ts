import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    // these modules don’t need to be in your client bundle
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // also turn off Node‐only fallbacks
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      ...config.resolve.fallback,
    };
    return config;
  },
};

export default nextConfig;
