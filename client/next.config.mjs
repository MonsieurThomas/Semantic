/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    port: process.env.PORT || 3000,
  },
};

export default nextConfig;
