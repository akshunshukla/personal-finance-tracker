import pool from "../../config/db.js";

export const getSummary = async ({ userId, role }) => {
  const query =
    role === "admin"
      ? `
        SELECT
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS total_income,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS total_expense
        FROM transactions
      `
      : `
        SELECT
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS total_income,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS total_expense
        FROM transactions
        WHERE user_id = $1
      `;

  const values = role === "admin" ? [] : [userId];

  const result = await pool.query(query, values);

  return result.rows[0];
};
