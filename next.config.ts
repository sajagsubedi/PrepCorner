import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn1.byjus.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.learnatnoon.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
