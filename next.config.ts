import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;

