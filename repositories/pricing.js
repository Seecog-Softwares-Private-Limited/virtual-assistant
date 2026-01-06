const { query } = require('../db/query');

async function findAll() {
  return query(
    'SELECT * FROM pricing_plans ORDER BY sort_order ASC, id ASC'
  );
}

async function findById(id) {
  const rows = await query(
    'SELECT * FROM pricing_plans WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function findActive() {
  return query(
    'SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
  );
}

async function create(data) {
  const featuresJson = JSON.stringify(data.features || []);
  const result = await query(
    `INSERT INTO pricing_plans
     (name, price_monthly, features_json, is_popular, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      parseFloat(data.priceMonthly),
      featuresJson,
      data.isPopular ? 1 : 0,
      data.isActive ? 1 : 0,
      parseInt(data.sortOrder || 0, 10)
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const featuresJson = JSON.stringify(data.features || []);
  await query(
    `UPDATE pricing_plans SET
     name = ?,
     price_monthly = ?,
     features_json = ?,
     is_popular = ?,
     is_active = ?,
     sort_order = ?
     WHERE id = ?`,
    [
      data.name,
      parseFloat(data.priceMonthly),
      featuresJson,
      data.isPopular ? 1 : 0,
      data.isActive ? 1 : 0,
      parseInt(data.sortOrder || 0, 10),
      id
    ]
  );
  return findById(id);
}

async function remove(id) {
  const result = await query(
    'DELETE FROM pricing_plans WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

// Helper to parse features_json
function parseFeatures(plan) {
  if (!plan) return null;
  try {
    if (typeof plan.features_json === 'string') {
      plan.features = JSON.parse(plan.features_json);
    } else if (plan.features_json) {
      plan.features = plan.features_json;
    } else {
      plan.features = [];
    }
    delete plan.features_json;
  } catch (e) {
    plan.features = [];
  }
  return plan;
}

module.exports = {
  findAll,
  findById,
  findActive,
  create,
  update,
  remove,
  parseFeatures
};

