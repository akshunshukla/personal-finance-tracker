import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { getSummary } from "./analytics.service.js";
import redis from "../../config/redis.js";

export const fetchSummary = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;

  const cacheKey =
    role === "admin"
      ? "analytics:summary:admin"
      : `analytics:summary:user:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res
      .status(200)
      .json(new ApiResponse(200, cached, "Analytics summary (cached)"));
  }

  const summary = await getSummary({ userId, role });

  const netBalance =
    Number(summary.total_income) - Number(summary.total_expense);

  const response = {
    totalIncome: summary.total_income,
    totalExpense: summary.total_expense,
    netBalance,
  };

  await redis.set(cacheKey, response, {
    ex: Number(process.env.ANALYTICS_CACHE_TTL),
  });

  res
    .status(200)
    .json(new ApiResponse(200, response, "Analytics summary fetched"));
});
