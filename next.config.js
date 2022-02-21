/* eslint-disable no-unused-vars */
/** @type {import('next').NextConfig} */
module.exports = {
  swcMinify: true,
  webpack5: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  cssLoaderOptions: {
    url: false,
  },
  typescript: {
    ignoreBuildErrors: true,
    forceConsistentCasingInFileNames: false,
  },
  experimental: {
    styledComponents: true,
  },
  reactStrictMode: true,
  compress: true,
  webpack: (config, _) => {
    config.resolve.extensions = [...config.resolve.extensions, ...['.gql', '.graphql']];
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });

    return config;
  },
};
