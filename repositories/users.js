const { query } = require('../db/query');
const bcrypt = require('bcrypt');

async function findByEmail(email) {
  const rows = await query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const rows = await query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * Create user
 * - If data.password is provided -> store bcrypt hash
 * - If data.password is missing/null -> store NULL (SSO user)
 */
async function create(data) {
  const passwordHash = data.password
    ? await bcrypt.hash(data.password, 10)
    : null;

  const result = await query(
    'INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
    [data.name, data.email, passwordHash, data.phone || null]
  );

  return findById(result.insertId);
}

async function update(id, data) {
  const updates = [];
  const params = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    params.push(data.name);
  }

  if (data.email !== undefined) {
    updates.push('email = ?');
    params.push(data.email);
  }

  if (data.phone !== undefined) {
    updates.push('phone = ?');
    params.push(data.phone);
  }

  // If password explicitly provided:
  // - If empty string/null => set password_hash NULL (to convert to SSO-only if needed)
  // - Else hash and save
  if (data.password !== undefined) {
    if (!data.password) {
      updates.push('password_hash = ?');
      params.push(null);
    } else {
      const passwordHash = await bcrypt.hash(data.password, 10);
      updates.push('password_hash = ?');
      params.push(passwordHash);
    }
  }

  if (updates.length === 0) {
    return findById(id);
  }

  params.push(id);

  await query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    params
  );

  return findById(id);
}

module.exports = {
  findByEmail,
  findById,
  create,
  update
};
