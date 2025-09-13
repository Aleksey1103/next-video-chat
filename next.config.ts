import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { remotePatterns: [new URL('https://lh3.googleusercontent.com/**')] },
  experimental: {
    serverActions: {
      allowedOrigins: [
        process.env['AUTH_URL'], // Add your GitHub Codespace URL
        "localhost:3000", // Allow local development
      ],
    },
  },
};

export default nextConfig;
