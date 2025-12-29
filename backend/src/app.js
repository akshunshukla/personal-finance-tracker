import express from "express";
import cors from "cors";
import helmet from "helmet";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// error handler LAST
app.use(errorHandler);

export default app;
