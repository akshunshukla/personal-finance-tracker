import { Router } from "express";
import {
  fetchTransactions,
  addTransaction,
  removeTransaction,
  editTransaction,
} from "./transaction.controller.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/rbac.middleware.js";
import { writeRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "user", "read-only"),
  fetchTransactions
);

router.post(
  "/",
  authenticate,
  writeRateLimiter,
  authorizeRoles("admin", "user"),
  addTransaction
);

router.put(
  "/:id",
  authenticate,
  writeRateLimiter,
  authorizeRoles("admin", "user"),
  editTransaction
);

router.delete(
  "/:id",
  authenticate,
  writeRateLimiter,
  authorizeRoles("admin", "user"),
  removeTransaction
);
export default router;
