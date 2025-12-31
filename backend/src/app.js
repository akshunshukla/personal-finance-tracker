import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route.js";
import transactionRoutes from "./modules/transactions/transaction.route.js";
import analyticsRoutes from "./modules/analytics/analytics.route.js";
import categoryRoutes from "./modules/categories/category.route.js";
import userRoutes from "./modules/users/user.route.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/users", userRoutes);

app.use(errorHandler);

export default app;
