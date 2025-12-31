import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { getAllUsers } from "./user.service.js";

export const fetchUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});
