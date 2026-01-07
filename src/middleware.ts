import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Simple in-memory rate limiter for middleware
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const key = ip;
  const existing = rateLimitMap.get(key);

  if (!existing || existing.resetTime < now) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count++;
  return true;
}

// Cleanup old entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (entry.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }, 60000);
}

// Blocked patterns for security
const BLOCKED_PATTERNS = [
  /\.\.\//, // Path traversal
  /\.(env|git|ssh|aws)/i, // Sensitive files
  /<script/i, // XSS attempts
  /\b(SELECT|INSERT|DELETE|DROP|UNION)\b.*\b(FROM|INTO|TABLE)\b/i, // SQL injection
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  // Block suspicious requests
  const url = request.url.toLowerCase();
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(url) || pattern.test(pathname)) {
      console.warn(`[Security] Blocked suspicious request from ${clientIP}: ${pathname}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // Rate limit auth endpoints more strictly (5 requests per minute)
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    if (!checkRateLimit(`auth:${clientIP}`, 10, 60000)) {
      console.warn(`[Security] Rate limit exceeded for auth from ${clientIP}`);
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: { 'Retry-After': '60' }
      });
    }
  }

  // Rate limit API endpoints (100 requests per minute)
  if (pathname.startsWith('/api/')) {
    if (!checkRateLimit(`api:${clientIP}`, 100, 60000)) {
      console.warn(`[Security] Rate limit exceeded for API from ${clientIP}`);
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: { 'Retry-After': '60' }
      });
    }
  }

  // Block common attack paths
  const blockedPaths = [
    '/wp-admin',
    '/wp-login',
    '/.env',
    '/.git',
    '/phpmyadmin',
    '/admin/config',
    '/xmlrpc.php',
    '/wp-includes',
  ];

  if (blockedPaths.some(blocked => pathname.toLowerCase().startsWith(blocked))) {
    console.warn(`[Security] Blocked attack path from ${clientIP}: ${pathname}`);
    return new NextResponse('Not Found', { status: 404 });
  }

  // Continue with session management
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
