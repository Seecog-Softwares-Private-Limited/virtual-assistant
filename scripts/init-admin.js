const bcrypt = require('bcrypt');
const { getAdmins, saveAdmins } = require('../utils/storage');

async function initAdmin() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin123';
  
  console.log(`Creating admin user: ${username}`);
  
  try {
    const admins = await getAdmins();
    
    // Check if admin already exists
    const existing = admins.find(a => a.username === username);
    if (existing) {
      console.log('Admin user already exists. Updating password...');
      const passwordHash = await bcrypt.hash(password, 10);
      existing.passwordHash = passwordHash;
      await saveAdmins(admins);
      console.log('✅ Admin password updated successfully!');
      console.log(`Username: ${username}`);
      console.log(`Password: ${password}`);
    } else {
      // Create new admin
      const passwordHash = await bcrypt.hash(password, 10);
      const newAdmin = {
        id: Date.now(),
        username,
        passwordHash,
        email: `${username}@stellapetservices.com`,
        createdAt: new Date().toISOString()
      };
      
      admins.push(newAdmin);
      await saveAdmins(admins);
      console.log('✅ Admin user created successfully!');
      console.log(`Username: ${username}`);
      console.log(`Password: ${password}`);
    }
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

initAdmin();

