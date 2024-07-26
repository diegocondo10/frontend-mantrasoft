/* eslint-disable no-unused-vars */
/** @type {import('next').NextConfig} */
module.exports = {
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
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
