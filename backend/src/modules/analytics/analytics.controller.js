import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
} from "./analytics.service.js";
import redis from "../../config/redis.js";

export const fetchSummary = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;

  const cacheKey =
    role === "admin"
      ? "analytics:summary:admin"
      : `analytics:summary:user:${userId}`;

  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  const cached = await redis.get(cacheKey);
  if (cached) {
    try {
      return res
        .status(200)
        .json(
          new ApiResponse(200, JSON.parse(cached), "Analytics summary (cached)")
        );
    } catch (error) {
      console.error("Redis parse error", error);
    }
  }

  const [summary, categoryData, trendData] = await Promise.all([
    getSummary({ userId, role }),
    getCategoryBreakdown({ userId, role }),
    getMonthlyTrends({ userId, role }),
  ]);

  const netBalance =
    Number(summary.total_income) - Number(summary.total_expense);

  const response = {
    totalIncome: summary.total_income,
    totalExpense: summary.total_expense,
    netBalance,
    categoryBreakdown: categoryData,
    monthlyTrends: trendData,
  };

  await redis.set(cacheKey, JSON.stringify(response), {
    ex: Number(process.env.ANALYTICS_CACHE_TTL || 300),
  });

  res
    .status(200)
    .json(new ApiResponse(200, response, "Analytics summary fetched"));
});
