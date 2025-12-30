import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.route.js";
import authenticate from "./middlewares/auth.middleware.js";
import authorizeRoles from "./middlewares/rbac.middleware.js";
import transactionRoutes from "./modules/transactions/transaction.route.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

app.get(
  "/api/test/all",
  authenticate,
  authorizeRoles("admin", "user", "read-only"),
  (req, res) => {
    res.json({ message: "All roles allowed" });
  }
);

app.get(
  "/api/test/admin",
  authenticate,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin only" });
  }
);

app.use("/api/transactions", transactionRoutes);
app.use(errorHandler);

export default app;
