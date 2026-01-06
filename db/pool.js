const mysql = require('mysql2/promise');
const config = require('../config/env');

let pool = null;

function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: config.db.host,
        port: config.db.port,
        database: config.db.database,
        user: config.db.user,
        password: config.db.password,
        waitForConnections: config.db.waitForConnections,
        connectionLimit: config.db.connectionLimit,
        enableKeepAlive: config.db.enableKeepAlive,
        queueLimit: config.db.queueLimit
      });
      
      console.log('✅ Database pool created');
    } catch (error) {
      console.error('❌ Failed to create database pool:', error.message);
      if (error.code === 'ER_BAD_DB_ERROR' || error.errno === 1049) {
        console.error(`\n💡 Database '${config.db.database}' does not exist.`);
        console.error('   Please run migrations first: npm run migrate\n');
      }
      throw error;
    }
  }
  return pool;
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✅ Database pool closed');
  }
}

module.exports = {
  getPool,
  closePool
};

