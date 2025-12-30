import pool from "../../config/db.js";

export const getTransactions = async ({ userId, role, limit, offset }) => {
  if (role === "admin") {
    const result = await pool.query(
      `SELECT * FROM transactions
       ORDER BY transaction_date DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  const result = await pool.query(
    `SELECT * FROM transactions
     WHERE user_id = $1
     ORDER BY transaction_date DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows;
};

export const createTransaction = async ({
  userId,
  type,
  category,
  amount,
  transactionDate,
}) => {
  const result = await pool.query(
    `INSERT INTO transactions (
      user_id,
      type,
      category,
      amount,
      transaction_date
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [userId, type, category, amount, transactionDate]
  );

  return result.rows[0];
};

export const updateTransaction = async ({
  transactionId,
  userId,
  role,
  type,
  category,
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
            category = $2,
            amount = $3,
            transaction_date = $4
        WHERE id = $5 AND user_id = $6
        RETURNING *`;

  const values =
    role === "admin"
      ? [type, category, amount, transactionDate, transactionId]
      : [type, category, amount, transactionDate, transactionId, userId];

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
