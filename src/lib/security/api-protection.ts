import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMIT_CONFIGS, type RateLimitConfig } from './rate-limit';

export interface ProtectedRouteOptions {
  requireAuth?: boolean;
  rateLimit?: RateLimitConfig;
  allowedMethods?: string[];
}

export interface ProtectedContext {
  userId: string | null;
  supabase: ReturnType<typeof createClient>;
}

/**
 * Wrapper for protected API routes with built-in security
 */
export function withProtection<T>(
  handler: (request: Request, context: ProtectedContext) => Promise<T>,
  options: ProtectedRouteOptions = {}
) {
  const {
    requireAuth = true,
    rateLimit = RATE_LIMIT_CONFIGS.api,
    allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  } = options;

  return async (request: Request): Promise<NextResponse> => {
    try {
      // Check HTTP method
      if (!allowedMethods.includes(request.method)) {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
      }

      // Rate limiting
      const clientId = getClientIdentifier(request);
      const rateLimitResult = checkRateLimit(
        `${clientId}:${new URL(request.url).pathname}`,
        rateLimit
      );

      if (!rateLimitResult.success) {
        return NextResponse.json(
          { 
            error: 'Too many requests', 
            retryAfter: Math.ceil(rateLimitResult.resetIn / 1000) 
          },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil(rateLimitResult.resetIn / 1000).toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(Date.now() + rateLimitResult.resetIn).toISOString(),
            }
          }
        );
      }

      // Authentication check
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (requireAuth && !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Call the handler
      const result = await handler(request, {
        userId: user?.id || null,
        supabase,
      });

      // Add security headers to response
      const response = result instanceof NextResponse 
        ? result 
        : NextResponse.json(result);

      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      
      return response;
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Validate and sanitize input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, ''); // Remove remaining angle brackets
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Check for common SQL injection patterns
 */
export function hasSqlInjection(input: string): boolean {
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
    /(--)|(\/\*)|(\*\/)/,
    /(;.*--)/,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
  ];
  
  return patterns.some(pattern => pattern.test(input));
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  body: T,
  required: (keyof T)[]
): { valid: boolean; missing: string[] } {
  const missing = required.filter(
    field => body[field] === undefined || body[field] === null || body[field] === ''
  );
  
  return {
    valid: missing.length === 0,
    missing: missing as string[],
  };
}

