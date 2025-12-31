import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { authRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);

export default router;
