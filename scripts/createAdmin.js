const readline = require('readline');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const config = require('../config/env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createAdmin() {
  let connection;
  
  try {
    console.log('👤 Creating admin user...\n');
    
    // Initialize database connection
    connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password
    });

    let email, password;
    
    // Check if email and password provided as arguments
    if (process.argv[2] && process.argv[3]) {
      email = process.argv[2].trim();
      password = process.argv[3];
    } else {
      // Prompt for input
      email = await question('Enter admin email: ');
      email = email.trim();
      
      if (!email || !email.includes('@')) {
        console.error('❌ Valid email is required');
        rl.close();
        process.exit(1);
      }
      
      password = await question('Enter admin password: ');
      if (!password || password.length < 6) {
        console.error('❌ Password must be at least 6 characters');
        rl.close();
        process.exit(1);
      }
    }
    
    console.log(`\n📧 Email: ${email}`);
    console.log('🔐 Hashing password...');
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insert or update admin (idempotent)
    const [result] = await connection.query(`
      INSERT INTO admins (email, password_hash)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
    `, [email, passwordHash]);
    
    // Get the admin record
    const [admins] = await connection.query(
      'SELECT id, email, created_at FROM admins WHERE email = ?',
      [email]
    );
    
    const admin = admins[0];
    
    if (result.insertId || admins.length > 0) {
      console.log('\n✅ Admin user created/updated successfully!');
      console.log(`   ID: ${admin.id}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Created: ${admin.created_at}`);
      console.log('\n💡 You can now login at /admin/login\n');
    } else {
      console.log('\n⚠️  Admin user may already exist');
    }
    
    await connection.end();
    rl.close();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('   Email already exists. Use UPDATE instead or choose a different email.');
    }
    if (connection) {
      await connection.end();
    }
    rl.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;
