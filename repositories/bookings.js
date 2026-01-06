const { query } = require('../db/query');

async function findAll(filters = {}) {
  let sql = 'SELECT * FROM bookings WHERE 1=1';
  const params = [];
  
  if (filters.userId) {
    sql += ' AND user_id = ?';
    params.push(filters.userId);
  }
  
  if (filters.status && filters.status !== 'all') {
    sql += ' AND status = ?';
    params.push(filters.status);
  }
  
  if (filters.search) {
    sql += ` AND (
      customer_name LIKE ? OR
      phone LIKE ? OR
      email LIKE ? OR
      service_title_snapshot LIKE ?
    )`;
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  sql += ' ORDER BY created_at DESC';
  
  return query(sql, params);
}

async function findById(id) {
  const rows = await query(
    'SELECT * FROM bookings WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function findPaginated(filters = {}, page = 1, perPage = 20) {
  const offset = (page - 1) * perPage;
  let sql = 'SELECT * FROM bookings WHERE 1=1';
  const params = [];
  
  if (filters.userId) {
    sql += ' AND user_id = ?';
    params.push(filters.userId);
  }
  
  if (filters.status && filters.status !== 'all') {
    sql += ' AND status = ?';
    params.push(filters.status);
  }
  
  if (filters.search) {
    sql += ` AND (
      customer_name LIKE ? OR
      phone LIKE ? OR
      email LIKE ? OR
      service_title_snapshot LIKE ?
    )`;
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(perPage, offset);
  
  const bookings = await query(sql, params);
  
  // Get total count
  let countSql = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1';
  const countParams = [];
  
  if (filters.userId) {
    countSql += ' AND user_id = ?';
    countParams.push(filters.userId);
  }
  
  if (filters.status && filters.status !== 'all') {
    countSql += ' AND status = ?';
    countParams.push(filters.status);
  }
  
  if (filters.search) {
    countSql += ` AND (
      customer_name LIKE ? OR
      phone LIKE ? OR
      email LIKE ? OR
      service_title_snapshot LIKE ?
    )`;
    const searchTerm = `%${filters.search}%`;
    countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  const [countResult] = await query(countSql, countParams);
  const total = countResult.total;
  
  return {
    bookings,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage)
  };
}

async function create(data) {
  const result = await query(
    `INSERT INTO bookings
     (user_id, customer_name, phone, email, address_line1, address_line2, city, state, pincode,
      service_id, service_title_snapshot, preferred_date, preferred_time,
      pet_type, pet_breed, pet_age, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.userId || null,
      data.customerName || data.contactName || '',
      data.phone || '',
      data.email || null,
      data.address || data.addressLine1 || '',
      data.addressLine2 || null,
      data.city || '',
      data.state || '',
      data.zipCode || data.pincode || '',
      data.serviceId || null,
      data.serviceTitle || data.service || '',
      data.preferredDate || '',
      data.preferredTime || '',
      data.petType || null,
      data.petBreed || null,
      data.petAge || null,
      data.notes || null,
      data.status || 'New'
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const updates = [];
  const params = [];
  
  if (data.status !== undefined) {
    updates.push('status = ?');
    params.push(data.status);
  }
  
  if (updates.length === 0) {
    return findById(id);
  }
  
  params.push(id);
  await query(
    `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`,
    params
  );
  return findById(id);
}

async function remove(id) {
  const result = await query(
    'DELETE FROM bookings WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

async function getStatusCounts() {
  const rows = await query(
    `SELECT 
      status,
      COUNT(*) as count
     FROM bookings
     GROUP BY status`
  );
  
  const counts = {
    all: 0,
    New: 0,
    Confirmed: 0,
    Completed: 0,
    Cancelled: 0
  };
  
  rows.forEach(row => {
    counts[row.status] = row.count;
    counts.all += row.count;
  });
  
  return counts;
}

module.exports = {
  findAll,
  findById,
  findPaginated,
  create,
  update,
  remove,
  getStatusCounts
};

