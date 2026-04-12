import type { NextConfig } from "next";

/** Allow browser auth/API calls to your exact Supabase project (custom domains, regional URLs, etc.). */
function supabaseConnectOrigins(): string[] {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url?.startsWith("http")) return [];
  try {
    return [new URL(url).origin];
  } catch {
    return [];
  }
}

function contentSecurityPolicy(): string {
  const isDev = process.env.NODE_ENV === "development";
  const connectSrc = [
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://*.functions.supabase.co",
    "https://api.stripe.com",
    // Google OAuth (signInWithOAuth)
    "https://accounts.google.com",
    "https://oauth2.googleapis.com",
    "https://www.googleapis.com",
    ...supabaseConnectOrigins(),
    ...(isDev
      ? [
          "http://127.0.0.1:54321",
          "http://localhost:54321",
          "ws://127.0.0.1:54321",
          "ws://localhost:54321",
        ]
      : []),
  ];

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://*.supabase.co https://*.stripe.com",
    `connect-src ${connectSrc.join(" ")}`,
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://accounts.google.com",
    "frame-ancestors 'none'",
    "form-action 'self' https://accounts.google.com",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const securityHeaders = [
  // Prevent clickjacking attacks
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // Prevent MIME type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // Enable XSS filter in browsers
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  // Control referrer information
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // Enforce HTTPS
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  // Permissions Policy (formerly Feature-Policy)
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  },
  // Content Security Policy (connect-src includes env-derived Supabase origin + OAuth)
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy(),
  },
];

const nextConfig: NextConfig = {
  // Security headers for all routes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Enable strict mode for React
  reactStrictMode: true,
  
  // Image optimization security
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
