# Stella Pet Services - Complete Project Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Analysis](#architecture-analysis)
3. [Database Structure](#database-structure)
4. [How to Update Database Changes](#how-to-update-database-changes)
5. [How to Run the Project](#how-to-run-the-project)
6. [Development Workflow](#development-workflow)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Stella Pet Services** is a full-stack web application for managing at-home pet services including grooming, walking, vaccination, boarding, and training.

### Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: MySQL (mysql2)
- **Templating**: Handlebars (express-handlebars)
- **Styling**: TailwindCSS
- **Authentication**: bcrypt + express-session
- **Frontend JS**: Alpine.js

### Key Features
- ✅ User authentication (register/login)
- ✅ Admin panel with CRUD operations
- ✅ Booking management system
- ✅ Service and pricing management
- ✅ Responsive design with dark mode
- ✅ Premium UI with animations

---

## 🏗️ Architecture Analysis

### Project Structure

```
stella-pet-services/
├── config/
│   └── env.js                 # Environment configuration
├── db/
│   ├── migrate.js             # Database migration script
│   ├── seed.js                # Database seeding script
│   ├── pool.js                # Database connection pool
│   └── query.js                # Database query helper
├── middleware/
│   ├── auth.js                # Authentication middleware
│   └── security.js            # Security middleware
├── repositories/
│   ├── users.js               # User data access layer
│   ├── admins.js              # Admin data access layer
│   ├── bookings.js            # Booking data access layer
│   ├── services.js            # Service data access layer
│   └── pricing.js             # Pricing data access layer
├── routes/
│   ├── user/
│   │   ├── auth.js            # User authentication routes
│   │   └── dashboard.js       # User dashboard routes
│   ├── admin/
│   │   ├── auth.js            # Admin authentication routes
│   │   ├── dashboard.js       # Admin dashboard routes
│   │   ├── bookings.js        # Admin booking management
│   │   ├── services.js        # Admin service management
│   │   └── pricing.js         # Admin pricing management
│   ├── home.js                # Home page routes
│   ├── services.js            # Public services page
│   ├── pricing.js             # Public pricing page
│   ├── booking.js             # Booking form routes
│   └── about.js                # About page routes
├── views/
│   ├── layouts/
│   │   ├── main.hbs           # Main layout template
│   │   └── admin.hbs           # Admin layout template
│   ├── pages/                  # Page templates
│   ├── partials/               # Reusable partials
│   ├── user/                   # User-facing templates
│   └── admin/                  # Admin templates
├── public/
│   ├── css/
│   │   ├── input.css          # TailwindCSS input
│   │   └── output.css          # Compiled CSS
│   └── js/
│       └── main.js             # Frontend JavaScript
├── scripts/
│   ├── startup.js             # Comprehensive startup script
│   └── createAdmin.js         # Admin creation script
├── server.js                   # Express server entry point
└── package.json                # Dependencies and scripts
```

### Architecture Patterns

1. **MVC Pattern**: Routes (Controllers) → Repositories (Models) → Views
2. **Repository Pattern**: Data access abstraction layer
3. **Middleware Pattern**: Authentication, security, validation
4. **Migration Pattern**: Version-controlled database schema

---

## 🗄️ Database Structure

### Current Database Schema

#### Tables:

1. **`admins`** - Admin users
   - `id` (BIGINT, PK)
   - `email` (VARCHAR(255), UNIQUE)
   - `password_hash` (VARCHAR(255))
   - `created_at` (DATETIME)

2. **`users`** - Regular users/customers
   - `id` (BIGINT, PK)
   - `name` (VARCHAR(120))
   - `email` (VARCHAR(255), UNIQUE)
   - `password_hash` (VARCHAR(255))
   - `phone` (VARCHAR(30), NULL)
   - `created_at`, `updated_at` (DATETIME)

3. **`services`** - Pet services offered
   - `id` (BIGINT, PK)
   - `category` (VARCHAR(100))
   - `title` (VARCHAR(150))
   - `description` (TEXT)
   - `duration_mins` (INT)
   - `starting_price` (DECIMAL(10,2))
   - `includes_json` (JSON)
   - `is_active` (TINYINT(1))
   - `sort_order` (INT)
   - `created_at`, `updated_at` (DATETIME)

4. **`pricing_plans`** - Membership plans
   - `id` (BIGINT, PK)
   - `name` (VARCHAR(100), UNIQUE)
   - `price_monthly` (DECIMAL(10,2))
   - `features_json` (JSON)
   - `is_popular` (TINYINT(1))
   - `is_active` (TINYINT(1))
   - `sort_order` (INT)
   - `created_at`, `updated_at` (DATETIME)

5. **`bookings`** - Customer bookings
   - `id` (BIGINT, PK)
   - `user_id` (BIGINT, FK → users.id, NULL)
   - `customer_name` (VARCHAR(120))
   - `phone` (VARCHAR(30))
   - `email` (VARCHAR(255))
   - `address_line1`, `address_line2` (VARCHAR(255))
   - `city`, `state`, `pincode` (VARCHAR)
   - `service_id` (BIGINT, FK → services.id, NULL)
   - `service_title_snapshot` (VARCHAR(150))
   - `preferred_date` (DATE)
   - `preferred_time` (VARCHAR(20))
   - `pet_type`, `pet_breed`, `pet_age` (VARCHAR)
   - `notes` (TEXT)
   - `status` (ENUM: 'New', 'Confirmed', 'Completed', 'Cancelled')
   - `created_at`, `updated_at` (DATETIME)

### Foreign Keys
- `bookings.user_id` → `users.id` (ON DELETE SET NULL)
- `bookings.service_id` → `services.id` (ON DELETE SET NULL)

---

## 🔄 How to Update Database Changes

### Understanding the Migration System

The project uses a **manual migration system** where database schema changes are made directly in `db/migrate.js`. The migration script is **idempotent** (safe to run multiple times) using `CREATE TABLE IF NOT EXISTS`.

### Step-by-Step: Adding Database Changes

#### **Method 1: Modify Existing Migration (Recommended for Development)**

1. **Edit `db/migrate.js`**
   ```javascript
   // Add your new table or column changes here
   await connection.query(`
     CREATE TABLE IF NOT EXISTS your_new_table (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
   `);
   ```

2. **For adding columns to existing tables**, use ALTER TABLE with existence check:
   ```javascript
   // Check if column exists
   const [columns] = await connection.query(`
     SELECT COLUMN_NAME 
     FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = ? 
     AND TABLE_NAME = 'your_table' 
     AND COLUMN_NAME = 'new_column'
   `, [config.db.database]);
   
   if (columns.length === 0) {
     await connection.query(`
       ALTER TABLE your_table 
       ADD COLUMN new_column VARCHAR(255) NULL
     `);
   }
   ```

3. **Run the migration**
   ```bash
   npm run migrate
   ```

#### **Method 2: Create Versioned Migrations (Recommended for Production)**

For production environments, consider creating versioned migration files:

1. **Create a new migration file**: `db/migrations/001_add_user_preferences.sql`
2. **Update `migrate.js`** to run migrations in order
3. **Track migration state** in a `migrations` table

**Example Structure:**
```
db/
├── migrate.js              # Main migration runner
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_add_users_table.sql
    └── 003_add_user_preferences.sql
```

### Common Database Operations

#### **Adding a New Table**

```javascript
// In db/migrate.js, after existing table creations
await connection.query(`
  CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_preference (user_id, preference_key)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`);
console.log('✅ Table: user_preferences');
```

#### **Adding a Column to Existing Table**

```javascript
// Check if column exists first
const [columns] = await connection.query(`
  SELECT COLUMN_NAME 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = ? 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'avatar_url'
`, [config.db.database]);

if (columns.length === 0) {
  await connection.query(`
    ALTER TABLE users 
    ADD COLUMN avatar_url VARCHAR(255) NULL AFTER phone
  `);
  console.log('✅ Added avatar_url column to users table');
}
```

#### **Adding an Index**

```javascript
// Check if index exists
const [indexes] = await connection.query(`
  SELECT INDEX_NAME 
  FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = ? 
  AND TABLE_NAME = 'bookings' 
  AND INDEX_NAME = 'idx_customer_email'
`, [config.db.database]);

if (indexes.length === 0) {
  await connection.query(`
    ALTER TABLE bookings 
    ADD INDEX idx_customer_email (email)
  `);
  console.log('✅ Added index idx_customer_email');
}
```

#### **Modifying Column Type**

```javascript
// For existing databases, use ALTER TABLE MODIFY
await connection.query(`
  ALTER TABLE users 
  MODIFY COLUMN phone VARCHAR(50) NULL
`);
```

### Best Practices for Database Changes

1. ✅ **Always check if column/table exists** before creating
2. ✅ **Use transactions** for multiple related changes
3. ✅ **Test migrations** on a copy of production data
4. ✅ **Document changes** in migration comments
5. ✅ **Backup database** before running migrations in production
6. ✅ **Use NULL defaults** for new columns added to existing tables
7. ✅ **Add indexes** for frequently queried columns

### Migration Workflow

```bash
# 1. Make changes to db/migrate.js
# 2. Test locally
npm run migrate

# 3. Verify changes
mysql -u root -p stella_pet_services
SHOW TABLES;
DESCRIBE your_table;

# 4. Commit changes
git add db/migrate.js
git commit -m "Add user preferences table"

# 5. Deploy and run migration on production
npm run migrate
```

---

## 🚀 How to Run the Project

### Prerequisites

1. **Node.js** (v14 or higher)
2. **MySQL** (v5.7 or higher, or MariaDB 10.3+)
3. **npm** (comes with Node.js)

### Quick Start (Recommended)

#### **Option 1: One-Command Setup** ⚡

```bash
# Install dependencies
npm install

# Create .env file (see Environment Setup below)

# Run everything: creates DB + tables + starts server
npm run start:full

# Or for development with auto-reload:
npm run dev:full

# With demo data:
npm run start:seed
# or
npm run dev:seed
```

This automatically:
- ✅ Checks for `.env` file
- ✅ Builds CSS
- ✅ Creates database (if doesn't exist)
- ✅ Creates all tables
- ✅ Optionally seeds demo data
- ✅ Starts the server

#### **Option 2: Step-by-Step Setup**

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Environment Setup

Create a `.env` file in the project root:

```bash
# Database Configuration
DB_HOST_STAGE=localhost
DB_PORT_STAGE=3306
DB_NAME_STAGE=stella_pet_services
DB_USER_STAGE=root
DB_PASSWORD_STAGE=your_mysql_password

# Session Secret (change in production!)
SESSION_SECRET=your-random-secret-key-here-min-32-chars

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important**: 
- Replace `your_mysql_password` with your MySQL root password
- Generate a strong `SESSION_SECRET` (use: `openssl rand -base64 32`)

### Step 3: Start MySQL Server

**macOS (Homebrew):**
```bash
brew services start mysql
# or
mysql.server start
```

**Linux:**
```bash
sudo systemctl start mysql
# or
sudo service mysql start
```

**Windows:**
```bash
# Start MySQL service from Services panel
# or run mysqld.exe
```

### Step 4: Create Database and Tables

```bash
npm run migrate
```

This will:
- Create database `stella_pet_services` (if doesn't exist)
- Create all tables (admins, users, services, pricing_plans, bookings)
- Add indexes and foreign keys

### Step 5: Seed Demo Data (Optional)

```bash
npm run seed
```

This populates:
- 1 admin user: `admin@stellapetservices.com` / `admin123`
- 12 sample services
- 3 pricing plans
- 10 sample bookings

### Step 6: Create Admin User (If not seeded)

```bash
npm run create-admin admin@example.com yourpassword
```

### Step 7: Build CSS

```bash
# Production build (minified)
npm run build:css:prod

# Development build (watch mode - run in separate terminal)
npm run build:css
```

### Step 8: Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

### Step 9: Access the Application

Open your browser:
- **Home**: http://localhost:3000
- **User Login**: http://localhost:3000/login
- **User Register**: http://localhost:3000/register
- **User Dashboard**: http://localhost:3000/dashboard (after login)
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin (after login)

---

## 💻 Development Workflow

### Available NPM Scripts

#### **Main Commands**
```bash
npm start              # Start production server
npm run dev            # Start development server (nodemon)
npm run start:full     # One-command setup + start (production)
npm run dev:full       # One-command setup + start (development)
npm run start:seed     # Setup + seed + start (production)
npm run dev:seed       # Setup + seed + start (development)
```

#### **Database Commands**
```bash
npm run migrate        # Create database and tables
npm run seed           # Populate with demo data
npm run create-admin   # Create/update admin user
npm run setup          # Run migrate + seed
```

#### **Build Commands**
```bash
npm run build:css           # Build CSS with watch mode
npm run build:css:prod     # Build CSS for production (minified)
```

### Development Tips

1. **Run CSS watch in separate terminal:**
   ```bash
   npm run build:css
   ```

2. **Check database connection:**
   ```bash
   mysql -u root -p -e "USE stella_pet_services; SHOW TABLES;"
   ```

3. **View logs:**
   - Server logs appear in terminal
   - Database queries logged to console

4. **Reset database:**
   ```bash
   # Drop and recreate
   mysql -u root -p -e "DROP DATABASE IF EXISTS stella_pet_services;"
   npm run migrate
   npm run seed
   ```

---

## 🔧 Troubleshooting

### Common Issues

#### **1. Database Connection Error**

**Error**: `ER_ACCESS_DENIED_ERROR` or `ECONNREFUSED`

**Solutions**:
```bash
# Check MySQL is running
mysql.server status  # macOS
sudo systemctl status mysql  # Linux

# Verify credentials in .env
# Test connection manually
mysql -u root -p -h localhost
```

#### **2. Migration Fails**

**Error**: `Table already exists` or foreign key errors

**Solutions**:
- Migration is idempotent, but if issues occur:
```bash
# Check existing tables
mysql -u root -p stella_pet_services -e "SHOW TABLES;"

# Drop specific table if needed (careful!)
mysql -u root -p stella_pet_services -e "DROP TABLE IF EXISTS table_name;"

# Re-run migration
npm run migrate
```

#### **3. CSS Not Building**

**Error**: `tailwindcss: command not found`

**Solutions**:
```bash
# Install dependencies
npm install

# Or use npx
npx tailwindcss -i ./public/css/input.css -o ./public/css/output.css --minify
```

#### **4. Port Already in Use**

**Error**: `EADDRINUSE: address already in use :::3000`

**Solutions**:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9  # macOS/Linux

# Or change PORT in .env
PORT=3001
```

#### **5. Session Not Working**

**Error**: Can't stay logged in

**Solutions**:
- Check `SESSION_SECRET` is set in `.env`
- Clear browser cookies
- Check session store configuration

#### **6. Foreign Key Constraint Errors**

**Error**: `Cannot add foreign key constraint`

**Solutions**:
- Ensure referenced table exists
- Check data types match
- Verify referenced column has index
- Check table engine is InnoDB

### Debugging Commands

```bash
# Check database structure
mysql -u root -p stella_pet_services -e "DESCRIBE bookings;"

# View all tables
mysql -u root -p stella_pet_services -e "SHOW TABLES;"

# Check foreign keys
mysql -u root -p stella_pet_services -e "SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'stella_pet_services';"

# View recent bookings
mysql -u root -p stella_pet_services -e "SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5;"
```

---

## 📝 Summary

### Quick Reference

**First Time Setup:**
```bash
npm install
# Create .env file
npm run start:full
```

**Update Database:**
```bash
# Edit db/migrate.js
npm run migrate
```

**Run Project:**
```bash
npm run dev:full    # Development
npm start           # Production
```

**Reset Everything:**
```bash
mysql -u root -p -e "DROP DATABASE stella_pet_services;"
npm run migrate
npm run seed
npm run create-admin admin@example.com password
```

---

## 📚 Additional Resources

- **Admin Guide**: See `ADMIN_README.md`
- **Database Setup**: See `README_DB_SETUP.md`
- **Troubleshooting**: See `TROUBLESHOOTING.md`
- **Migration Guide**: See `MIGRATION_GUIDE.md`

---

**Last Updated**: 2024
**Project Version**: 1.0.0

