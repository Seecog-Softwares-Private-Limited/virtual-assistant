const { query } = require('../db/query');
const bcrypt = require('bcrypt');

async function findByEmail(email) {
  const rows = await query(
    'SELECT * FROM admins WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const rows = await query(
    'SELECT * FROM admins WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function create(email, passwordHash) {
  const result = await query(
    'INSERT INTO admins (email, password_hash) VALUES (?, ?)',
    [email, passwordHash]
  );
  return findById(result.insertId);
}

async function createIfNotExists(email, passwordHash) {
  const existing = await findByEmail(email);
  if (existing) {
    // Update password if exists
    await query(
      'UPDATE admins SET password_hash = ? WHERE email = ?',
      [passwordHash, email]
    );
    return findByEmail(email);
  }
  return create(email, passwordHash);
}

module.exports = {
  findByEmail,
  findById,
  create,
  createIfNotExists
};

