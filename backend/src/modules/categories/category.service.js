import pool from "../../config/db.js";

export const getCategories = async () => {
  const result = await pool.query(
    "SELECT id, name FROM categories ORDER BY name"
  );
  return result.rows;
};
