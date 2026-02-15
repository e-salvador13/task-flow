import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/task-flow' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/task-flow/' : '',
};

export default nextConfig;
