const pool = require('../config/db');

async function createCase(userId, title, description) {
  const result = await pool.query(
    'INSERT INTO cases (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
    [userId, title, description]
  );
  return result.rows[0];
}

async function getCasesByUser(userId) {
  const result = await pool.query(
    'SELECT * FROM cases WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

async function getCaseById(caseId, userId) {
  const result = await pool.query(
    'SELECT * FROM cases WHERE id = $1 AND user_id = $2',
    [caseId, userId]
  );
  return result.rows[0];
}

async function deleteCase(caseId, userId) {
  const result = await pool.query(
    'DELETE FROM cases WHERE id = $1 AND user_id = $2 RETURNING *',
    [caseId, userId]
  );
  return result.rows[0];
}

module.exports = { createCase, getCasesByUser, getCaseById, deleteCase };