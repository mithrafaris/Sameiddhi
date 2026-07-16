const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

/**
 * Basic in-memory rate limiting for API routes.
 * 
 * @param ip Client IP address or unique identifier
 * @param limit Maximum number of requests allowed within the window
 * @param windowMs Time window in milliseconds
 * @returns true if the request is allowed, false if rate limited
 */
export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  
  // Cleanup expired entries every once in a while
  if (Math.random() < 0.1) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.expiresAt) {
        rateLimitMap.delete(key);
      }
    }
  }

  const record = rateLimitMap.get(ip);
  if (!record || now > record.expiresAt) {
    // First request or window expired
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false; // Rate limited
  }

  // Increment counter
  record.count += 1;
  return true;
}
