import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const withNextIntl = createNextIntlPlugin();
const isLocalDev = process.env.NODE_ENV === 'development';

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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "standalone",
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['next-auth'],
  async headers() {
    return isLocalDev ? [] : [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: permissionsPolicy },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRFToken, Content-Type, Authorization' },
          // { key: 'Expect-CT', value: 'max-age=86400, enforce, report-uri="https://yourdomain.com/report"' },
        ],
      },
    ];
  },
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   config.resolve.alias['@'] = path.resolve(__dirname);
  //   config.resolve.alias['@/components'] = path.resolve(__dirname, 'src/components');
  //   config.resolve.alias['@/config'] = path.resolve(__dirname, 'src/config');
  //   config.resolve.alias['@/lib'] = path.resolve(__dirname, 'src/lib');
  //   return config;
  // },
};

export default withNextIntl(nextConfig);