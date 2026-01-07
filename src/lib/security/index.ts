/**
 * NovaActa Security Module
 * Comprehensive security utilities for API and application protection
 */

export {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMIT_CONFIGS,
  type RateLimitConfig,
  type RateLimitResult,
} from './rate-limit';

export {
  withProtection,
  sanitizeInput,
  isValidEmail,
  isValidUrl,
  hasSqlInjection,
  validateRequiredFields,
  type ProtectedRouteOptions,
  type ProtectedContext,
} from './api-protection';

export { csrfProtection, validateCsrfToken, generateCsrfToken } from './csrf';

