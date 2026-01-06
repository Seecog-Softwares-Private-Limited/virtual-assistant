const mysql = require('mysql2/promise');
const config = require('../config/env');

async function migrate() {
  let connection;
  
  try {
    console.log('🔄 Starting database migration...');
    console.log(`📊 Database: ${config.db.database}@${config.db.host}:${config.db.port}`);
    
    // Connect without database first to create it if needed
    connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${config.db.database}' ready`);
    
    await connection.end();
    
    // Connect to the database
    connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password
    });

    // Create admins table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: admins');

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(30) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: users');

    // Create services table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        duration_mins INT NOT NULL,
        starting_price DECIMAL(10,2) NOT NULL,
        includes_json JSON NULL,
        is_active TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_is_active (is_active),
        INDEX idx_category (category),
        INDEX idx_sort_order (sort_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: services');

    // Create pricing_plans table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pricing_plans (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        price_monthly DECIMAL(10,2) NOT NULL,
        features_json JSON NULL,
        is_popular TINYINT(1) DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_is_active (is_active),
        INDEX idx_is_popular (is_popular),
        INDEX idx_sort_order (sort_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: pricing_plans');

    // Create bookings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NULL,
        customer_name VARCHAR(120) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(255) NULL,
        address_line1 VARCHAR(255) NOT NULL,
        address_line2 VARCHAR(255) NULL,
        city VARCHAR(80) NOT NULL,
        state VARCHAR(80) NOT NULL,
        pincode VARCHAR(20) NOT NULL,
        service_id BIGINT NULL,
        service_title_snapshot VARCHAR(150) NOT NULL,
        preferred_date DATE NOT NULL,
        preferred_time VARCHAR(20) NOT NULL,
        pet_type VARCHAR(50) NULL,
        pet_breed VARCHAR(80) NULL,
        pet_age VARCHAR(20) NULL,
        notes TEXT NULL,
        status ENUM('New','Confirmed','Completed','Cancelled') DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        INDEX idx_preferred_date (preferred_date),
        INDEX idx_email (email),
        INDEX idx_user_id (user_id),
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: bookings');

    // Add user_id column to bookings if it doesn't exist (for existing databases)
    try {
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'bookings' 
        AND COLUMN_NAME = 'user_id'
      `, [config.db.database]);
      
      if (columns.length === 0) {
        await connection.query(`
          ALTER TABLE bookings 
          ADD COLUMN user_id BIGINT NULL AFTER id
        `);
        await connection.query(`
          ALTER TABLE bookings 
          ADD INDEX idx_user_id (user_id)
        `);
        await connection.query(`
          ALTER TABLE bookings 
          ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        `);
        console.log('✅ Updated bookings table with user_id');
      } else {
        console.log('✅ Bookings table already has user_id column');
      }
    } catch (error) {
      // Column might already exist or FK constraint might fail, that's okay
      console.log('⚠️  Note: Could not add user_id to bookings table:', error.message);
    }

    await connection.end();
    console.log('\n✅ Migration completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Migration error:', error.message);
    console.error('Stack:', error.stack);
    if (connection) {
      await connection.end();
    }
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = migrate;
