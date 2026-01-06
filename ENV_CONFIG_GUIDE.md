# Environment Configuration Guide

This guide explains how to configure the application for both **staging** and **production** environments.

## 📁 Configuration Files

The application supports two configuration file formats:

1. **`properties.env`** (Recommended) - Contains all configurations in one file
2. **`.env`** (Alternative) - Standard dotenv format

The application will automatically use `properties.env` if it exists, otherwise it will fall back to `.env`.

## 🚀 Quick Start

### Step 1: Create Configuration File

Copy the example file:
```bash
cp properties.env .env
# or keep properties.env as-is
```

### Step 2: Update Configuration Values

Edit `properties.env` (or `.env`) and update the values:

```bash
# For STAGING/DEVELOPMENT
DB_HOST_STAGE=localhost
DB_PORT_STAGE=3306
DB_NAME_STAGE=stella_pet_services_stage
DB_USER_STAGE=root
DB_PASSWORD_STAGE=your_staging_password

# For PRODUCTION
DB_HOST_PROD=your-production-host.com
DB_PORT_PROD=3306
DB_NAME_PROD=stella_pet_services_prod
DB_USER_PROD=your_prod_user
DB_PASSWORD_PROD=your_production_password

# Session Secret (IMPORTANT: Change in production!)
SESSION_SECRET=your-secure-random-secret-key-min-32-chars
```

### Step 3: Set Environment and Run

**For Staging/Development:**
```bash
NODE_ENV=staging npm start
# or
NODE_ENV=development npm run dev
```

**For Production:**
```bash
NODE_ENV=production npm start
```

## 📋 Configuration Structure

### Environment Selection

The application uses `NODE_ENV` to determine which database configuration to use:

- **`NODE_ENV=production`** → Uses `DB_*_PROD` variables
- **`NODE_ENV=staging`** → Uses `DB_*_STAGE` variables  
- **`NODE_ENV=development`** → Uses `DB_*_STAGE` variables (default)

### Required Variables

#### Staging/Development Variables:
```bash
DB_HOST_STAGE=localhost
DB_PORT_STAGE=3306
DB_NAME_STAGE=stella_pet_services_stage
DB_USER_STAGE=root
DB_PASSWORD_STAGE=your_password
```

#### Production Variables:
```bash
DB_HOST_PROD=your-production-host.com
DB_PORT_PROD=3306
DB_NAME_PROD=stella_pet_services_prod
DB_USER_PROD=your_prod_user
DB_PASSWORD_PROD=your_production_password
```

#### Application Variables (Shared):
```bash
NODE_ENV=production          # or staging/development
PORT=3000                    # Server port
SESSION_SECRET=your-secret   # Session encryption key
SEED_DATA=false              # Auto-seed on startup
SKIP_MIGRATIONS=false       # Skip migrations on startup
```

## 🔐 Security Best Practices

### 1. Generate Secure Session Secret

```bash
# Generate a secure random secret
openssl rand -base64 32
```

### 2. Never Commit Secrets

- ✅ `properties.env` and `.env` are in `.gitignore`
- ✅ Use different secrets for staging and production
- ✅ Use environment variables on production servers

### 3. Production Checklist

- [ ] Change `SESSION_SECRET` to a secure random value
- [ ] Use strong database passwords
- [ ] Set `NODE_ENV=production`
- [ ] Use production database credentials
- [ ] Enable SSL/TLS for database connections (if possible)
- [ ] Set up proper firewall rules

## 🎯 Usage Examples

### Development Mode (Local)
```bash
# Set NODE_ENV to development (or staging)
export NODE_ENV=development

# Or inline:
NODE_ENV=development npm run dev

# Uses: DB_*_STAGE variables
```

### Staging Server
```bash
# Set NODE_ENV to staging
export NODE_ENV=staging
npm start

# Uses: DB_*_STAGE variables
```

### Production Server
```bash
# Set NODE_ENV to production
export NODE_ENV=production
npm start

# Uses: DB_*_PROD variables
```

### Using PM2 (Production Process Manager)
```bash
# Create ecosystem.config.js
module.exports = {
  apps: [{
    name: 'stella-pet-services',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: 'properties.env'
  }]
};

# Start with PM2
pm2 start ecosystem.config.js
```

### Using Docker
```bash
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    env_file:
      - properties.env
    environment:
      - NODE_ENV=production
    ports:
      - "3000:3000"
```

## 🔍 Verification

After setting up your configuration, verify it's working:

```bash
# Check which environment is active
node -e "require('dotenv').config({path:'properties.env'}); console.log('NODE_ENV:', process.env.NODE_ENV);"

# Test database connection
NODE_ENV=staging node -e "const config = require('./config/env'); console.log('DB:', config.db.database + '@' + config.db.host);"
```

## 🐛 Troubleshooting

### Issue: Wrong Database Being Used

**Problem**: Application connects to wrong database

**Solution**: 
- Check `NODE_ENV` is set correctly
- Verify corresponding `DB_*_STAGE` or `DB_*_PROD` variables exist
- Check `properties.env` file is in project root

### Issue: Missing Environment Variables

**Problem**: Error about missing variables

**Solution**:
- Ensure both `DB_*_STAGE` and `DB_*_PROD` variables are defined
- Check file is named `properties.env` or `.env`
- Verify file is in project root directory

### Issue: Session Not Working

**Problem**: Can't stay logged in

**Solution**:
- Ensure `SESSION_SECRET` is set
- Use different secrets for staging and production
- Check secret is at least 32 characters

## 📝 Configuration File Template

Here's a complete template for `properties.env`:

```bash
# ============================================
# ENVIRONMENT SELECTION
# ============================================
NODE_ENV=development

# ============================================
# STAGING ENVIRONMENT
# ============================================
DB_HOST_STAGE=localhost
DB_PORT_STAGE=3306
DB_NAME_STAGE=stella_pet_services_stage
DB_USER_STAGE=root
DB_PASSWORD_STAGE=

# ============================================
# PRODUCTION ENVIRONMENT
# ============================================
DB_HOST_PROD=your-production-host.com
DB_PORT_PROD=3306
DB_NAME_PROD=stella_pet_services_prod
DB_USER_PROD=your_prod_user
DB_PASSWORD_PROD=your_production_password

# ============================================
# APPLICATION CONFIG
# ============================================
PORT=3000
SESSION_SECRET=your-secure-secret-key-here-min-32-chars
SEED_DATA=false
SKIP_MIGRATIONS=false
```

## 🎓 Summary

1. **Create** `properties.env` file (or use `.env`)
2. **Configure** both staging (`DB_*_STAGE`) and production (`DB_*_PROD`) variables
3. **Set** `NODE_ENV` when running: `NODE_ENV=production npm start`
4. **Application** automatically selects the correct configuration based on `NODE_ENV`

The application will:
- ✅ Use `DB_*_PROD` when `NODE_ENV=production`
- ✅ Use `DB_*_STAGE` when `NODE_ENV=staging` or `development`
- ✅ Show clear error messages if configuration is missing
- ✅ Log which environment and database is being used

---

**Need Help?** Check `PROJECT_GUIDE.md` for more details.

