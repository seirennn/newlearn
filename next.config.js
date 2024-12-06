/** @type {import('next').NextConfig} */
const nextConfig = {

  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        stream: false,
        canvas: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
        'process/browser': require.resolve('process/browser'),
      };
    }

    // Add rule for pdf.worker.js
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource'
    });

    return config;
  },
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
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
};

module.exports = nextConfig;
