import pool from "../../config/db.js";

const SAFE_AMOUNT =
  "CAST(NULLIF(REGEXP_REPLACE(t.amount::text, '[^0-9.-]', '', 'g'), '') AS NUMERIC)";

export const getSummary = async ({ userId, role }) => {
  const query =
    role === "admin"
      ? `SELECT
          COALESCE(SUM(CASE WHEN LOWER(t.type) = 'income' THEN ${SAFE_AMOUNT} END), 0) AS total_income,
          COALESCE(SUM(CASE WHEN LOWER(t.type) = 'expense' THEN ${SAFE_AMOUNT} END), 0) AS total_expense
        FROM transactions t`
      : `SELECT
          COALESCE(SUM(CASE WHEN LOWER(t.type) = 'income' THEN ${SAFE_AMOUNT} END), 0) AS total_income,
          COALESCE(SUM(CASE WHEN LOWER(t.type) = 'expense' THEN ${SAFE_AMOUNT} END), 0) AS total_expense
        FROM transactions t 
        WHERE t.user_id::text = $1::text`;

  const values = role === "admin" ? [] : [userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getCategoryBreakdown = async ({ userId, role }) => {
  let query = `
    SELECT 
      COALESCE(c.name, 'Uncategorized') as category, 
      SUM(${SAFE_AMOUNT}) as total 
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE TRIM(LOWER(t.type::text)) = 'expense'
  `;

  const values = [];

  if (role !== "admin") {
    query += ` AND t.user_id::text = $1::text`;
    values.push(userId);
  }

  query += ` GROUP BY c.name`;

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (err) {
    console.error("DB Error in getCategoryBreakdown:", err.message);
    throw err;
  }
};

export const getMonthlyTrends = async ({ userId, role }) => {
  let query = `
    SELECT 
      TO_CHAR(t.transaction_date, 'YYYY-MM') as month, 
      SUM(CASE WHEN LOWER(t.type) = 'income' THEN ${SAFE_AMOUNT} END) as total_income,
      SUM(CASE WHEN LOWER(t.type) = 'expense' THEN ${SAFE_AMOUNT} END) as total_expense
    FROM transactions t
  `;

  const values = [];
  if (role !== "admin") {
    query += ` WHERE t.user_id::text = $1::text`;
    values.push(userId);
  }

  query += ` GROUP BY 1 ORDER BY 1 ASC LIMIT 6`;

  const result = await pool.query(query, values);
  return result.rows;
};
