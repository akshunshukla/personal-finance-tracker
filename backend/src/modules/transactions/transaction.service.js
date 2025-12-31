import pool from "../../config/db.js";

export const getTransactions = async ({
  userId,
  role,
  limit,
  offset,
  type,
  categoryId,
  startDate,
  endDate,
}) => {
  let query = `
    SELECT 
      t.id, 
      t.user_id, 
      t.type, 
      t.amount, 
      t.transaction_date, 
      t.created_at,
      c.id as category_id,
      c.name as category_name,
      c.type as category_type
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE 1=1
  `;

  const values = [];
  let paramIndex = 1;

  if (role !== "admin") {
    query += ` AND t.user_id = $${paramIndex}`;
    values.push(userId);
    paramIndex++;
  }

  if (type) {
    query += ` AND t.type = $${paramIndex}`;
    values.push(type);
    paramIndex++;
  }
  if (categoryId) {
    query += ` AND t.category_id = $${paramIndex}`;
    values.push(categoryId);
    paramIndex++;
  }
  if (startDate) {
    query += ` AND t.transaction_date >= $${paramIndex}`;
    values.push(startDate);
    paramIndex++;
  }
  if (endDate) {
    query += ` AND t.transaction_date <= $${paramIndex}`;
    values.push(endDate);
    paramIndex++;
  }

  query += ` ORDER BY t.transaction_date DESC LIMIT $${paramIndex} OFFSET $${
    paramIndex + 1
  }`;
  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
};

export const createTransaction = async ({
  userId,
  type,
  categoryId,
  amount,
  transactionDate,
}) => {
  const result = await pool.query(
    `INSERT INTO transactions (
      user_id,
      type,
      category_id,
      amount,
      transaction_date
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [userId, type, categoryId, amount, transactionDate]
  );

  return result.rows[0];
};

export const updateTransaction = async ({
  transactionId,
  userId,
  role,
  type,
  categoryId,
  amount,
  transactionDate,
}) => {
  const query =
    role === "admin"
      ? `
        UPDATE transactions
        SET type = $1,
            category = $2,
            amount = $3,
            transaction_date = $4
        WHERE id = $5
        RETURNING *`
      : `
        UPDATE transactions
        SET type = $1,
            category_id = $2,
            amount = $3,
            transaction_date = $4
        WHERE id = $5 AND user_id = $6
        RETURNING *`;

  const values =
    role === "admin"
      ? [type, categoryId, amount, transactionDate, transactionId]
      : [type, categoryId, amount, transactionDate, transactionId, userId];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const deleteTransaction = async ({ transactionId, userId, role }) => {
  const query =
    role === "admin"
      ? "DELETE FROM transactions WHERE id = $1 RETURNING *"
      : "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *";

  const values = role === "admin" ? [transactionId] : [transactionId, userId];

  const result = await pool.query(query, values);

  return result.rows[0];
};
