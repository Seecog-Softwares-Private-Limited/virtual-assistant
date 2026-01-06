# MySQL Migration Guide

This guide will help you migrate from JSON file storage to MySQL database.

## Prerequisites

1. MySQL Server installed and running
2. Node.js and npm installed
3. All dependencies installed (`npm install`)

## Step-by-Step Setup

### 1. Create MySQL Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE stella_pet_services CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Set Environment Variables

Create a `.env` file in the project root (or set environment variables):

```bash
# Database Configuration
DB_HOST_STAGE=localhost
DB_PORT_STAGE=3306
DB_NAME_STAGE=stella_pet_services
DB_USER_STAGE=root
DB_PASSWORD_STAGE=

# Session Secret (change in production!)
SESSION_SECRET=your-secret-key-here-change-in-production

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development
```

**Important:** Copy `.env.example` to `.env` and update values as needed.

### 3. Install Dependencies

```bash
npm install
```

This will install:
- `mysql2` - MySQL client
- `dotenv` - Environment variable loader
- `express-validator` - Input validation

### 4. Run Database Migration

This will create all necessary tables:

```bash
npm run migrate
```

You should see:
```
✅ Database 'stella_pet_services' ready
✅ Table: admins
✅ Table: services
✅ Table: pricing_plans
✅ Table: bookings
✅ Migration completed successfully
```

### 5. Seed Initial Data (Optional)

To populate services and pricing plans:

```bash
npm run seed
```

### 6. Create Admin User

Create your first admin user:

```bash
npm run create-admin
```

Or with arguments:
```bash
npm run create-admin admin@example.com yourpassword
```

### 7. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will:
1. Load environment variables
2. Run database migrations automatically
3. Initialize database connection pool
4. Start listening on port 3000

## Database Schema

### Tables Created

1. **admins** - Admin user accounts
2. **services** - Service offerings
3. **pricing_plans** - Pricing packages
4. **bookings** - Customer bookings

### Key Features

- All tables use `utf8mb4` character set
- Foreign keys with `ON DELETE SET NULL` for referential integrity
- Indexes on frequently queried columns (status, created_at, is_active)
- JSON columns for arrays (includes_json, features_json)
- Automatic timestamps (created_at, updated_at)

## Migration from JSON Files

### Data Migration (if you have existing JSON data)

If you have existing data in JSON files, you can write a migration script:

```javascript
// Example: migrate-services.js
const { create } = require('./repositories/services');
const { services } = require('./data/services');

async function migrate() {
  for (const service of services) {
    await create({
      category: service.category,
      title: service.title,
      description: service.description,
      durationMins: service.duration || 0,
      startingPrice: service.price,
      includes: service.included || [],
      isActive: true,
      sortOrder: service.sortOrder || 0
    });
  }
}
```

## Verification

1. **Check Tables:**
   ```sql
   USE stella_pet_services;
   SHOW TABLES;
   ```

2. **Verify Admin User:**
   ```sql
   SELECT * FROM admins;
   ```

3. **Test Login:**
   - Navigate to `http://localhost:3000/admin/login`
   - Login with your admin credentials

4. **Test Booking:**
   - Navigate to `http://localhost:3000/booking`
   - Submit a test booking
   - Check in admin panel: `http://localhost:3000/admin/bookings`

## Troubleshooting

### Connection Errors

**Error: `ER_ACCESS_DENIED_ERROR`**
- Check MySQL username and password in `.env`
- Verify MySQL user has CREATE DATABASE privileges

**Error: `ECONNREFUSED`**
- Ensure MySQL server is running
- Check host and port in `.env`

### Migration Errors

**Error: Table already exists**
- Tables are created with `IF NOT EXISTS`, so this shouldn't happen
- If it does, drop and recreate: `DROP DATABASE stella_pet_services; CREATE DATABASE stella_pet_services;`

### Data Issues

**Services/Pricing not showing:**
- Run seed: `npm run seed`
- Or manually add data through admin panel

**Bookings not saving:**
- Check database connection
- Verify booking form fields match database schema
- Check server logs for errors

## Production Checklist

- [ ] Set strong `SESSION_SECRET` environment variable
- [ ] Use secure MySQL password (not empty)
- [ ] Enable MySQL SSL connections
- [ ] Set up database backups
- [ ] Configure connection pool limits appropriately
- [ ] Monitor database performance
- [ ] Set up proper MySQL user permissions (not root)
- [ ] Enable MySQL query logging for debugging
- [ ] Set `NODE_ENV=production`

## Architecture Notes

### Connection Pool

- **Connection Limit:** 10 concurrent connections
- **Keep-Alive:** Enabled for better performance
- **Queue Limit:** Unlimited (0)

### Query Safety

- All queries use parameterized statements (prevents SQL injection)
- Input validation with express-validator
- Type conversion for numeric fields
- JSON parsing with error handling

### Repository Pattern

All database operations are abstracted in `/repositories`:
- `repositories/admins.js` - Admin operations
- `repositories/services.js` - Service CRUD
- `repositories/pricing.js` - Pricing plan CRUD
- `repositories/bookings.js` - Booking operations

This makes it easy to:
- Swap database implementations
- Add caching layers
- Add business logic
- Write tests

## Next Steps

1. Test all admin CRUD operations
2. Test booking form submission
3. Verify data persistence across server restarts
4. Set up database backups
5. Monitor performance and optimize queries if needed

