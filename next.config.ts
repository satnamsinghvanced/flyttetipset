import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['vanced.solutions'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flyttetipset.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vanced.solutions",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
