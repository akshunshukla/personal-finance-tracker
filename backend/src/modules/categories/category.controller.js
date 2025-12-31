import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { getCategories, createCategory } from "./category.service.js";
import redis from "../../config/redis.js";

export const fetchCategories = asyncHandler(async (req, res) => {
  const cacheKey = "categories:list";

  const cachedCategories = await redis.get(cacheKey);
  if (cachedCategories) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedCategories, "Categories fetched (cached)")
      );
  }

  const categories = await getCategories();

  await redis.set(cacheKey, categories, { ex: 3600 });

  res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

export const addCategory = asyncHandler(async (req, res) => {
  const { name, type } = req.body;

  const category = await createCategory({ name, type });

  await redis.del("categories:list");

  res.status(201).json(new ApiResponse(201, category, "Category created"));
});
