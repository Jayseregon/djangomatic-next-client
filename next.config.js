const createNextIntlPlugin = require('next-intl/plugin');
const path = require('path');
const withNextIntl = createNextIntlPlugin();
const isDev = process.env.NODE_ENV === 'development';

const permissionsPolicy = `
  accelerometer=(), 
  ambient-light-sensor=(), 
  autoplay=(), 
  battery=(), 
  camera=(), 
  display-capture=(), 
  document-domain=(), 
  encrypted-media=(), 
  fullscreen=(), 
  geolocation=(), 
  gyroscope=(), 
  layout-animations=(), 
  legacy-image-formats=(), 
  magnetometer=(), 
  microphone=(), 
  midi=(), 
  navigation-override=(), 
  payment=(), 
  picture-in-picture=(), 
  publickey-credentials-get=(), 
  sync-xhr=(), 
  usb=(), 
  wake-lock=(), 
  web-share=(), 
  xr-spatial-tracking=()
`.replace(/\n/g, '');

const nextConfig = {
  output: "standalone",
  async headers() {
    return isDev ? [] : [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: permissionsPolicy },
          // { key: 'Expect-CT', value: 'max-age=86400, enforce, report-uri="https://yourdomain.com/report"' },
        ],
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    config.resolve.alias['@/components'] = path.resolve(__dirname, 'src/components');
    config.resolve.alias['@/config'] = path.resolve(__dirname, 'src/config');
    return config;
  },
};

module.exports = withNextIntl(nextConfig);