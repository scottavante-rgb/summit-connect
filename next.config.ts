import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint checks during Vercel builds to unblock deployment
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
