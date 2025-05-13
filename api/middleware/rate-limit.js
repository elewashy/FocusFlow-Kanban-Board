// Simple in-memory rate limiter
// In production, use Redis or a similar distributed cache
const rateLimit = new Map();

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now - value.timestamp > 3600000) { // 1 hour
      rateLimit.delete(key);
    }
  }
}, 3600000);

export async function rateLimit(req, maxRequests, timeWindowSeconds) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const timeWindow = timeWindowSeconds * 1000; // Convert to milliseconds

  // Get or initialize rate limit data for this IP
  let rateLimitData = rateLimit.get(ip) || {
    requests: [],
    timestamp: now
  };

  // Remove requests outside the time window
  rateLimitData.requests = rateLimitData.requests.filter(
    timestamp => now - timestamp < timeWindow
  );

  // Check if rate limit exceeded
  if (rateLimitData.requests.length >= maxRequests) {
    throw new Error('Rate limit exceeded');
  }

  // Add current request
  rateLimitData.requests.push(now);
  rateLimitData.timestamp = now;
  rateLimit.set(ip, rateLimitData);
}
