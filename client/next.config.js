/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    port: process.env.PORT || 3000,
  },
  async rewrites() {
    return [
      {
        source: '/socket.io',
        destination: '/api/socket',
      },
    ];
  },
};

module.exports = nextConfig;
