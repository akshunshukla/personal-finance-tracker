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

export const getCategoryBreakdown = async ({ userId, role }) => {
  let query = `
    SELECT c.name as category, SUM(t.amount) as total 
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.type = 'expense'
  `;
  const values = [];

  if (role !== "admin") {
    query += ` AND t.user_id = $1`;
    values.push(userId);
  }

  query += ` GROUP BY c.name`;

  const result = await pool.query(query, values);
  return result.rows;
};

export const getMonthlyTrends = async ({ userId, role }) => {
  let query = `
    SELECT 
      TO_CHAR(t.transaction_date, 'YYYY-MM') as month,
      SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
      SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expense
    FROM transactions t
  `;
  const values = [];

  if (role !== "admin") {
    query += ` WHERE t.user_id = $1`;
    values.push(userId);
  }

  query += ` GROUP BY 1 ORDER BY 1 ASC LIMIT 12`;

  const result = await pool.query(query, values);
  return result.rows;
};
