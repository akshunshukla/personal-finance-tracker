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

export const fetchTransactions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
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
  const { type, categoryId, amount, transactionDate } = req.body;

  const transaction = await createTransaction({
    userId: req.user.userId,
    type,
    categoryId,
    amount,
    transactionDate,
  });
  await redis.del(`analytics:summary:user:${req.user.userId}`);
  await redis.del("analytics:summary:admin");

  res
    .status(201)
    .json(new ApiResponse(201, transaction, "Transaction created"));
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
