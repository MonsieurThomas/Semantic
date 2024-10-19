/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    port: process.env.PORT || 3000,
  },
  images: {
    domains: ["img.freepik.com", "veterinaire-tour-hassan.com"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/socket.io',
        // source: "/api/socket",
        destination: "/api/socket",
      },
    ];
  },
};

module.exports = nextConfig;
