/**
 * Simple in-memory rate limiter for API routes
 * For production at scale, consider using Redis or Upstash
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per interval
}

export const RATE_LIMIT_CONFIGS = {
  // Strict limits for auth endpoints
  auth: { interval: 60 * 1000, maxRequests: 5 }, // 5 per minute
  // Standard API limits
  api: { interval: 60 * 1000, maxRequests: 60 }, // 60 per minute
  // Generous limits for public reads
  public: { interval: 60 * 1000, maxRequests: 120 }, // 120 per minute
  // Very strict for sensitive operations
  sensitive: { interval: 60 * 1000, maxRequests: 3 }, // 3 per minute
} as const;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number; // milliseconds until reset
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.api
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  
  const existing = rateLimitStore.get(key);
  
  if (!existing || existing.resetTime < now) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.interval,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: config.interval,
    };
  }
  
  if (existing.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetIn: existing.resetTime - now,
    };
  }
  
  // Increment counter
  existing.count++;
  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    resetIn: existing.resetTime - now,
  };
}

/**
 * Get client identifier from request
 * Uses IP address with fallback
 */
export function getClientIdentifier(request: Request): string {
  // Check for forwarded IP (when behind proxy/Vercel)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a hash of user agent + accept headers
  const ua = request.headers.get('user-agent') || 'unknown';
  const accept = request.headers.get('accept') || 'unknown';
  return `fallback-${hashString(ua + accept)}`;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

