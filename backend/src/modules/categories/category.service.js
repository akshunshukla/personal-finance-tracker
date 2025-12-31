import pool from "../../config/db.js";

export const getCategories = async () => {
  const result = await pool.query(
    "SELECT id, name, type FROM categories ORDER BY name"
  );
  return result.rows;
};

export const createCategory = async ({ name, type }) => {
  const result = await pool.query(
    `INSERT INTO categories (name, type)
     VALUES ($1, $2)
     RETURNING *`,
    [name, type]
  );
  return result.rows[0];
};
