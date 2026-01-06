# Quick Environment Setup

## 🚀 One-Minute Setup

### 1. Copy Configuration Template
```bash
cp properties.env .env
# Or use properties.env directly
```

### 2. Edit Configuration
Open `properties.env` (or `.env`) and update:

**Staging/Development:**
```bash
DB_HOST_STAGE=localhost
DB_PORT_STAGE=3306
DB_NAME_STAGE=stella_pet_services_stage
DB_USER_STAGE=root
DB_PASSWORD_STAGE=your_password
```

**Production:**
```bash
DB_HOST_PROD=your-production-host.com
DB_PORT_PROD=3306
DB_NAME_PROD=stella_pet_services_prod
DB_USER_PROD=your_prod_user
DB_PASSWORD_PROD=your_production_password
```

**Required:**
```bash
SESSION_SECRET=your-secure-secret-key-min-32-chars
NODE_ENV=development  # or staging or production
```

### 3. Run Application

**Development:**
```bash
NODE_ENV=development npm run dev
```

**Staging:**
```bash
NODE_ENV=staging npm start
```

**Production:**
```bash
NODE_ENV=production npm start
```

## 📝 How It Works

- **`NODE_ENV=production`** → Uses `DB_*_PROD` variables
- **`NODE_ENV=staging`** → Uses `DB_*_STAGE` variables
- **`NODE_ENV=development`** → Uses `DB_*_STAGE` variables (default)

The application automatically selects the correct database configuration based on `NODE_ENV`.

## ✅ Verification

Check which environment is active:
```bash
# The app will log on startup:
# 📊 Environment: PRODUCTION
# 📊 Database: stella_pet_services_prod@your-host.com:3306
```

## 🔐 Security

Generate secure session secret:
```bash
openssl rand -base64 32
```

**Important:** Never commit `properties.env` or `.env` to git (already in .gitignore)

---

For detailed guide, see [ENV_CONFIG_GUIDE.md](./ENV_CONFIG_GUIDE.md)

