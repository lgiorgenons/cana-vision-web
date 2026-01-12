import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Allow images from the backend if needed in future
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://34.148.81.131:3000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
