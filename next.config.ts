import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.vivionconstructions.in",
      },
    ],
  },
};

export default nextConfig;
