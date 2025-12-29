import bcrypt from "bcrypt";
import pool from "../../config/db.js";
import ApiError from "../../utils/ApiError.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, created_at`,
    [name, email, hashedPassword]
  );

  return result.rows[0];
};
