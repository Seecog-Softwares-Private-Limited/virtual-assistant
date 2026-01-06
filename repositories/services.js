const { query } = require('../db/query');

async function findAll() {
  return query(
    'SELECT * FROM services ORDER BY sort_order ASC, id ASC'
  );
}

async function findById(id) {
  const rows = await query(
    'SELECT * FROM services WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function findActive() {
  return query(
    'SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
  );
}

async function create(data) {
  const includesJson = JSON.stringify(data.includes || []);
  const result = await query(
    `INSERT INTO services 
     (category, title, description, duration_mins, starting_price, includes_json, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.category,
      data.title,
      data.description,
      parseInt(data.durationMins, 10),
      parseFloat(data.startingPrice),
      includesJson,
      data.isActive ? 1 : 0,
      parseInt(data.sortOrder || 0, 10)
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const includesJson = JSON.stringify(data.includes || []);
  await query(
    `UPDATE services SET
     category = ?,
     title = ?,
     description = ?,
     duration_mins = ?,
     starting_price = ?,
     includes_json = ?,
     is_active = ?,
     sort_order = ?
     WHERE id = ?`,
    [
      data.category,
      data.title,
      data.description,
      parseInt(data.durationMins, 10),
      parseFloat(data.startingPrice),
      includesJson,
      data.isActive ? 1 : 0,
      parseInt(data.sortOrder || 0, 10),
      id
    ]
  );
  return findById(id);
}

async function remove(id) {
  const result = await query(
    'DELETE FROM services WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

// Helper to parse includes_json
function parseIncludes(service) {
  if (!service) return null;
  try {
    if (typeof service.includes_json === 'string') {
      service.includes = JSON.parse(service.includes_json);
    } else if (service.includes_json) {
      service.includes = service.includes_json;
    } else {
      service.includes = [];
    }
    delete service.includes_json;
  } catch (e) {
    service.includes = [];
  }
  return service;
}

module.exports = {
  findAll,
  findById,
  findActive,
  create,
  update,
  remove,
  parseIncludes
};

