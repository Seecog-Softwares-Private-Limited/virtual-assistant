const { query } = require('../db/query');

/**
 * Find user by provider identity:
 * provider: 'google' or 'facebook'
 * providerUserId: provider's unique id
 */
async function findUserByIdentity(provider, providerUserId) {
  const rows = await query(
    `SELECT u.*
     FROM user_identities ui
     JOIN users u ON u.id = ui.user_id
     WHERE ui.provider = ? AND ui.provider_user_id = ?
     LIMIT 1`,
    [provider, providerUserId]
  );

  return rows[0] || null;
}

/**
 * Link identity to an existing user
 * Uses INSERT IGNORE to avoid duplicate link errors.
 */
async function linkIdentity({ userId, provider, providerUserId, email }) {
  await query(
    `INSERT IGNORE INTO user_identities (user_id, provider, provider_user_id, email)
     VALUES (?, ?, ?, ?)`,
    [userId, provider, providerUserId, email || null]
  );

  // Return the identity row (optional)
  const rows = await query(
    `SELECT * FROM user_identities
     WHERE provider = ? AND provider_user_id = ?
     LIMIT 1`,
    [provider, providerUserId]
  );
  return rows[0] || null;
}

/**
 * Optional: find identity row only (not user)
 */
async function findIdentity(provider, providerUserId) {
  const rows = await query(
    `SELECT * FROM user_identities
     WHERE provider = ? AND provider_user_id = ?
     LIMIT 1`,
    [provider, providerUserId]
  );
  return rows[0] || null;
}

module.exports = {
  findUserByIdentity,
  linkIdentity,
  findIdentity
};
