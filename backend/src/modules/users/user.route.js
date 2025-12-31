import { Router } from "express";
import { fetchUsers } from "./user.controller.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/rbac.middleware.js";

const router = Router();

router.get("/", authenticate, authorizeRoles("admin"), fetchUsers);

export default router;
