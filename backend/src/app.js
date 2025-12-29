import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.route.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
