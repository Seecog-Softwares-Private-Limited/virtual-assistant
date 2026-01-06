const { getPool } = require('./pool');

/**
 * Execute a query with parameters
 * @param {string} sql - SQL query with placeholders
 * @param {Array} params - Parameters for the query
 * @returns {Promise<Array>} Query results
 */
async function query(sql, params = []) {
  const pool = getPool();
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    // Handle database not found error
    if (error.code === 'ER_BAD_DB_ERROR' || error.errno === 1049) {
      const config = require('../config/env');
      console.error('\n❌ Database Error: Database does not exist');
      console.error(`   Database: ${config.db.database}`);
      console.error(`   Host: ${config.db.host}:${config.db.port}`);
      console.error('\n💡 Solution: Run database migrations first');
      console.error('   Command: npm run migrate\n');
      throw new Error(`Database '${config.db.database}' does not exist. Please run: npm run migrate`);
    }
    
    console.error('Query error:', error.message);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Execute a transaction
 * @param {Function} callback - Async function that receives a connection
 * @returns {Promise<any>} Result from callback
 */
async function transaction(callback) {
  const pool = getPool();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Execute a query within a transaction
 * @param {object} connection - MySQL connection from transaction
 * @param {string} sql - SQL query
 * @param {Array} params - Parameters
 * @returns {Promise<Array>} Query results
 */
async function queryTx(connection, sql, params = []) {
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Transaction query error:', error.message);
    throw error;
  }
}

module.exports = {
  query,
  transaction,
  queryTx
};

