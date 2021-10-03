/** @type {import('next').NextConfig} */
module.exports = {
  // cssModules: false,
  webpack5: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  target: "serverless",
  cssLoaderOptions: {
    url: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.extensions = [...config.resolve.extensions, ...[".gql", ".graphql"]];
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });

    return config;
  },
};
