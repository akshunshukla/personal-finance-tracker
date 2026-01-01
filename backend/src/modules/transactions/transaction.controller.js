import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  getTransactions,
  updateTransaction,
  deleteTransaction,
  createTransaction,
} from "./transaction.service.js";
import ApiError from "../../utils/ApiError.js";
import redis from "../../config/redis.js";
import pool from "../../config/db.js";

export const fetchTransactions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    type,
    categoryId,
    startDate,
    endDate,
  } = req.query;

  const offset = (page - 1) * limit;

  const transactions = await getTransactions({
    userId: req.user.userId,
    role: req.user.role,
    limit: Number(limit),
    offset: Number(offset),
    search,
    type,
    categoryId,
    startDate,
    endDate,
  });

  res
    .status(200)
    .json(new ApiResponse(200, transactions, "Transactions fetched"));
});

export const addTransaction = asyncHandler(async (req, res) => {
  const { amount, type, transactionDate, category } = req.body;
  const userId = req.user.userId;

  let categoryId = null;

  if (category) {
    const categoryResult = await pool.query(
      `SELECT id FROM categories WHERE name = $1 LIMIT 1`,
      [category]
    );

    if (categoryResult.rows.length > 0) {
      categoryId = categoryResult.rows[0].id;
    } else {
      console.warn(`Category '${category}' not found in database.`);
    }
  }

  const query = `
    INSERT INTO transactions (user_id, amount, type, transaction_date, category_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [userId, amount, type, transactionDate, categoryId];

  const result = await pool.query(query, values);

  const cacheKey = `analytics:summary:user:${userId}`;
  const adminCacheKey = "analytics:summary:admin";
  await redis.del(cacheKey);
  await redis.del(adminCacheKey);

  res
    .status(201)
    .json(
      new ApiResponse(201, result.rows[0], "Transaction added successfully")
    );
});

export const editTransaction = asyncHandler(async (req, res) => {
  const { type, categoryId, amount, transactionDate } = req.body;
  const updated = await updateTransaction({
    transactionId: req.params.id,
    userId: req.user.userId,
    role: req.user.role,
    type,
    categoryId,
    amount,
    transactionDate,
  });

  if (!updated) {
    throw new ApiError(404, "Transaction not found or unauthorized");
  }
  await redis.del(`analytics:summary:user:${updated.userId}`);
  await redis.del("analytics:summary:admin");

  res.status(200).json(new ApiResponse(200, updated, "Transaction updated"));
});

export const removeTransaction = asyncHandler(async (req, res) => {
  const deleted = await deleteTransaction({
    transactionId: req.params.id,
    userId: req.user.userId,
    role: req.user.role,
  });

  if (!deleted) {
    throw new ApiError(404, "Transaction not found or unauthorized");
  }
  await redis.del(`analytics:summary:user:${deleted.userId}`);
  await redis.del("analytics:summary:admin");

  res.status(200).json(new ApiResponse(200, deleted, "Transaction deleted"));
});
