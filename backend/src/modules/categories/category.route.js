import { Router } from "express";
import { fetchCategories } from "./category.controller.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, fetchCategories);

export default router;
