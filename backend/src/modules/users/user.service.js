import pool from "../../config/db.js";

export const getAllUsers = async () => {
  const query = `
    SELECT id, name, email, role, created_at 
    FROM users 
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};
