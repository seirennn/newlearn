/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.anthropic.com',
      },
      {
        protocol: 'https',
        hostname: 'anthropic.com',
      },
      {
        protocol: 'https',
        hostname: 'www.openai.com',
      },
      {
        protocol: 'https',
        hostname: 'openai.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
      };
    }
    // Add rule for pdf.worker.js
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource'
    });
    return config;
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
