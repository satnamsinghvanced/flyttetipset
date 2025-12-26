import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["flyttetipset.no"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flyttetipset.no",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3002",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.flyttetipset.no",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
