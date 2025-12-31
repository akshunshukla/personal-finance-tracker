import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
});

export const writeRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 write requests
  message: {
    success: false,
    message: "Too many write requests, please slow down",
  },
});
