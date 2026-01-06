# One-Command Startup Guide

## 🎯 Overview

You can now set up the database, create tables, and start the project with a **single command**!

## 🚀 Quick Start

### Basic Usage

```bash
# Install dependencies first
npm install

# Create .env file (see below)

# Run everything in one command
npm run start:full
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run start:full` | Production mode: Creates DB + tables + starts server |
| `npm run dev:full` | Development mode: Creates DB + tables + starts server (with nodemon) |
| `npm run start:seed` | Same as `start:full` + seeds demo data |
| `npm run dev:seed` | Same as `dev:full` + seeds demo data |

### Command Line Flags

You can also use flags with the startup script:

```bash
# Seed data automatically
node scripts/startup.js --seed
# or
node scripts/startup.js -s

# Development mode
node scripts/startup.js --dev
# or
node scripts/startup.js -d

# Combine flags
node scripts/startup.js --dev --seed
```

## 📋 What the Startup Script Does

The `start:full` command automatically:

1. ✅ **Checks for `.env` file** - Validates environment configuration
2. ✅ **Builds CSS** - Compiles TailwindCSS (only if needed)
3. ✅ **Creates Database** - Creates `stella_pet_services` database if it doesn't exist
4. ✅ **Creates Tables** - Creates all required tables (admins, services, pricing_plans, bookings)
5. ✅ **Seeds Data** - Optionally seeds demo data (with `--seed` flag)
6. ✅ **Starts Server** - Launches the Express server

## 🔧 Environment Variables

Create a `.env` file in the project root:

```bash
# Database Configuration
DB_HOST_STAGE=localhost
DB_PORT_STAGE=3306
DB_NAME_STAGE=stella_pet_services
DB_USER_STAGE=root
DB_PASSWORD_STAGE=your_mysql_password

# Session Secret (change in production!)
SESSION_SECRET=your-secret-key-here-change-in-production

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development

# Optional: Auto-seed data
SEED_DATA=true
```

## 📝 Examples

### Example 1: First Time Setup
```bash
npm install
# Create .env file
npm run start:seed  # Creates DB + tables + seeds data + starts server
```

### Example 2: Development with Auto-Reload
```bash
npm run dev:full  # Creates DB + tables + starts dev server
```

### Example 3: Production Setup
```bash
npm run start:full  # Creates DB + tables + starts production server
```

## 🛠️ How It Works

1. **Startup Script** (`scripts/startup.js`):
   - Orchestrates the entire setup process
   - Runs migrations, builds CSS, optionally seeds data
   - Sets `SKIP_MIGRATIONS` env var to prevent duplicate migrations

2. **Server** (`server.js`):
   - Checks for `SKIP_MIGRATIONS` env var
   - Skips migrations if already run by startup script
   - Initializes database pool and starts Express server

3. **Migrations** (`db/migrate.js`):
   - Idempotent - safe to run multiple times
   - Uses `CREATE DATABASE IF NOT EXISTS` and `CREATE TABLE IF NOT EXISTS`

## ⚠️ Troubleshooting

### Error: `.env file not found`
- Create `.env` file in project root
- Copy from `.env.example` (if available) or use the template above

### Error: `Migration failed`
- Check MySQL server is running: `mysql -u root -p`
- Verify database credentials in `.env`
- Ensure MySQL user has CREATE DATABASE privileges

### Error: `CSS build failed`
- Script continues even if CSS build fails
- Manually run: `npm run build:css:prod`

### Migrations Run Twice?
- The startup script sets `SKIP_MIGRATIONS=true` to prevent this
- Server checks this env var and skips migrations if set

## 🎓 Benefits

✅ **Faster Setup** - One command instead of multiple steps  
✅ **Idempotent** - Safe to run multiple times  
✅ **Error Handling** - Clear error messages and validation  
✅ **Flexible** - Optional seeding, dev/prod modes  
✅ **User-Friendly** - Colored output and progress indicators  

## 📚 Related Commands

- `npm run migrate` - Run migrations only
- `npm run seed` - Seed data only
- `npm run create-admin` - Create admin user
- `npm start` - Start server only (assumes DB exists)
- `npm run dev` - Start dev server only (assumes DB exists)

---

**Happy Coding! 🎉**


