import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const writeRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: "Too many write requests, please slow down",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const analyticsRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message:
      "Analytics API rate limit exceeded, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
