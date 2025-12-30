import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { getCategories } from "./category.service.js";
import redis from "../../config/redis.js";

const CATEGORY_CACHE_KEY = "categories:list";

export const fetchCategories = asyncHandler(async (req, res) => {
  const cached = await redis.get(CATEGORY_CACHE_KEY);
  if (cached) {
    return res
      .status(200)
      .json(new ApiResponse(200, cached, "Categories fetched (cached)"));
  }

  const categories = await getCategories();

  await redis.set(CATEGORY_CACHE_KEY, categories, {
    ex: Number(process.env.CATEGORY_CACHE_TTL),
  });

  res.status(200).json(new ApiResponse(200, categories, "Categories fetched"));
});
