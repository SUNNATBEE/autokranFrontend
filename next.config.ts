import type { NextConfig } from "next";

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

// Backend API server URL (Express). Override via BACKEND_URL env var.
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

// Security headers applied to every response.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version.
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    // next/image v16 requires an explicit qualities allowlist.
    qualities: [70, 75, 85],
    formats: ['image/avif', 'image/webp'],
    // Allow optimisation of any external https image still referenced.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },

  // Proxy API and uploaded-file requests to the standalone backend so that
  // the browser keeps talking to a single origin (cookies stay first-party).
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
