import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
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
