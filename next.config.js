/** @type {import('next').NextConfig} */
module.exports = {
  webpack5: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  cssLoaderOptions: {
    url: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
