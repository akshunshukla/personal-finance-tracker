import { Router } from "express";
import { fetchSummary } from "./analytics.controller.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/rbac.middleware.js";
import { analyticsRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

router.get(
  "/summary",
  authenticate,
  analyticsRateLimiter,
  authorizeRoles("admin", "user", "read-only"),
  fetchSummary
);

export default router;
