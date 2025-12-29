import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { registerUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});
