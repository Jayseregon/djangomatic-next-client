const createNextIntlPlugin = require('next-intl/plugin');
const path = require('path');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Resolve aliases
    config.resolve.alias['@'] = path.resolve(__dirname);
    config.resolve.alias['@/components'] = path.resolve(__dirname, 'src/components');
    config.resolve.alias['@/config'] = path.resolve(__dirname, 'src/config');
    // Add other aliases as needed

    return config;
  },
};

module.exports = withNextIntl(nextConfig);