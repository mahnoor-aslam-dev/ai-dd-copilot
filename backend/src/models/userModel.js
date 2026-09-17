const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Naya user banana
async function createUser(name, email, password) {
  const password_hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
    [name, email, password_hash]
  );
  return result.rows[0];
}

// Email se user dhoondhna (login ke liye)
async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

module.exports = { createUser, findUserByEmail };