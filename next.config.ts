import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    optimizePackageImports: [
      'react',
      'react-dom'
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
