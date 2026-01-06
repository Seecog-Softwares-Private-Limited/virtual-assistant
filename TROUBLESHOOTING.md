# Troubleshooting Guide

## Issue: Tables Not Created on `npm start`

### Problem
When running `npm start`, database tables are not being created automatically.

### Root Causes & Solutions

#### 1. Missing `.env` File ✅ FIXED

**Symptom:** Server starts but tables don't exist, or you see "Missing required environment variables" error.

**Solution:**
- A `.env` file has been created in the project root
- If you need to recreate it, copy the template below:

```bash
# Database Configuration
DB_HOST_STAGE=localhost
DB_PORT_STAGE=3306
DB_NAME_STAGE=stella_pet_services
DB_USER_STAGE=root
DB_PASSWORD_STAGE=

# Session Secret
SESSION_SECRET=stella-pet-services-secret-key-change-in-production

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development
```

#### 2. MySQL Server Not Running

**Symptom:** Error like `ECONNREFUSED` or `ER_ACCESS_DENIED_ERROR`

**Solution:**
```bash
# Check if MySQL is running
# macOS (Homebrew):
brew services list | grep mysql

# Start MySQL:
brew services start mysql

# Linux:
sudo systemctl status mysql
sudo systemctl start mysql

# Windows:
# Check MySQL service in Services panel
```

#### 3. Incorrect Database Credentials

**Symptom:** `ER_ACCESS_DENIED_ERROR` or authentication failures

**Solution:**
- Update `.env` with correct MySQL credentials
- Ensure MySQL user has CREATE DATABASE privileges:
```sql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

#### 4. Database Already Exists But Tables Missing

**Symptom:** Database exists but tables are not created

**Solution:**
```bash
# Run migration manually
npm run migrate

# Or drop and recreate database
mysql -u root -e "DROP DATABASE IF EXISTS stella_pet_services;"
npm run migrate
```

### Verification Steps

After fixing the issue, verify tables are created:

```bash
# 1. Start the server
npm start

# You should see:
# 🔄 Running database migrations...
# ✅ Database 'stella_pet_services' ready
# ✅ Table: admins
# ✅ Table: services
# ✅ Table: pricing_plans
# ✅ Table: bookings
# ✅ Migrations completed successfully

# 2. Verify tables exist
mysql -u root -e "USE stella_pet_services; SHOW TABLES;"

# Should show:
# admins
# bookings
# pricing_plans
# services
```

### Manual Migration

If automatic migration fails, run manually:

```bash
# Run migration script directly
npm run migrate

# Then start server
npm start
```

### Enhanced Error Messages

The server now provides detailed error messages:

- **Missing .env:** Lists required variables and example values
- **Migration failure:** Shows MySQL error and troubleshooting tips
- **Connection failure:** Indicates MySQL server might not be running

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Missing required environment variables` | No `.env` file | Create `.env` file |
| `ECONNREFUSED` | MySQL not running | Start MySQL service |
| `ER_ACCESS_DENIED_ERROR` | Wrong credentials | Update `.env` credentials |
| `ER_DBACCESS_DENIED_ERROR` | No CREATE DB privilege | Grant privileges to user |
| `ER_BAD_DB_ERROR` | Database doesn't exist | Run `npm run migrate` |

### Next Steps After Fix

1. **Verify tables:**
   ```bash
   npm start
   # Check console output for migration success
   ```

2. **Seed data (optional):**
   ```bash
   npm run seed
   ```

3. **Create admin user:**
   ```bash
   npm run create-admin admin@example.com yourpassword
   ```

4. **Test the application:**
   - Visit `http://localhost:3000`
   - Login at `http://localhost:3000/admin/login`

