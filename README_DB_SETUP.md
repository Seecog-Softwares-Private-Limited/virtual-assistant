# Database Setup Guide

This guide explains how to set up and seed the MySQL database for Stella Pet Services.

## Prerequisites

1. MySQL Server installed and running
2. Node.js and npm installed
3. Environment variables configured (see `.env.example`)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create database and tables
npm run migrate

# 3. Seed demo data
npm run seed

# 4. Create admin user
npm run create-admin admin@example.com yourpassword

# 5. Start server
npm start
```

Or use the convenience script:

```bash
npm run setup
npm run create-admin admin@example.com yourpassword
npm start
```

## Environment Variables

Create a `.env` file in the project root:

```bash
DB_HOST_STAGE=localhost
DB_PORT_STAGE=3306
DB_NAME_STAGE=stella_pet_services
DB_USER_STAGE=root
DB_PASSWORD_STAGE=

SESSION_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
```

## Scripts

### `npm run migrate`

Creates the database (if it doesn't exist) and all required tables with proper indexes and foreign keys.

**What it does:**
- Creates database `stella_pet_services` with utf8mb4 charset
- Creates tables: `admins`, `services`, `pricing_plans`, `bookings`
- Adds indexes for performance
- Sets up foreign key constraints

**Idempotent:** Safe to run multiple times. Uses `CREATE TABLE IF NOT EXISTS`.

### `npm run seed`

Populates the database with demo/master data.

**What it seeds:**
- 1 admin user: `admin@stellapetservices.com` (password: `admin123`)
- 12 sample services across 6 categories
- 3 pricing plans: Basic, Standard, Premium
- 10 sample bookings with different statuses

**Idempotent:** Safe to run multiple times. Checks for existing records before inserting.

### `npm run create-admin`

Creates or updates an admin user.

**Usage:**
```bash
# Interactive mode
npm run create-admin

# With arguments
npm run create-admin admin@example.com yourpassword
```

**What it does:**
- Prompts for email and password (or uses command-line arguments)
- Hashes password with bcrypt
- Inserts or updates admin record
- Uses `ON DUPLICATE KEY UPDATE` for idempotency

## Database Schema

### Tables

1. **admins**
   - `id` (BIGINT, PK, AI)
   - `email` (VARCHAR(255), UNIQUE)
   - `password_hash` (VARCHAR(255))
   - `created_at` (DATETIME)

2. **services**
   - `id` (BIGINT, PK, AI)
   - `category` (VARCHAR(100))
   - `title` (VARCHAR(150))
   - `description` (TEXT)
   - `duration_mins` (INT)
   - `starting_price` (DECIMAL(10,2))
   - `includes_json` (JSON)
   - `is_active` (TINYINT(1))
   - `sort_order` (INT)
   - `created_at`, `updated_at` (DATETIME)

3. **pricing_plans**
   - `id` (BIGINT, PK, AI)
   - `name` (VARCHAR(100), UNIQUE)
   - `price_monthly` (DECIMAL(10,2))
   - `features_json` (JSON)
   - `is_popular` (TINYINT(1))
   - `is_active` (TINYINT(1))
   - `sort_order` (INT)
   - `created_at`, `updated_at` (DATETIME)

4. **bookings**
   - `id` (BIGINT, PK, AI)
   - `customer_name` (VARCHAR(120))
   - `phone` (VARCHAR(30))
   - `email` (VARCHAR(255))
   - `address_line1`, `address_line2` (VARCHAR(255))
   - `city`, `state`, `pincode` (VARCHAR)
   - `service_id` (BIGINT, FK to services.id)
   - `service_title_snapshot` (VARCHAR(150))
   - `preferred_date` (DATE)
   - `preferred_time` (VARCHAR(20))
   - `pet_type`, `pet_breed`, `pet_age` (VARCHAR)
   - `notes` (TEXT)
   - `status` (ENUM: 'New', 'Confirmed', 'Completed', 'Cancelled')
   - `created_at`, `updated_at` (DATETIME)

### Indexes

- `admins.email` - For fast login lookups
- `services.is_active`, `services.category`, `services.sort_order` - For filtering and sorting
- `pricing_plans.is_active`, `pricing_plans.is_popular`, `pricing_plans.sort_order` - For filtering
- `bookings.status`, `bookings.created_at`, `bookings.preferred_date`, `bookings.email` - For queries and filtering

### Foreign Keys

- `bookings.service_id` → `services.id` (ON DELETE SET NULL)

## Seeded Data

### Services (12 total)

**Grooming (2):**
- Professional Grooming - $75, 120 mins
- Express Grooming - $45, 60 mins

**Walking (2):**
- Dog Walking - $25, 30 mins
- Extended Walk - $40, 60 mins

**Vet/Vaccination (2):**
- At-Home Vaccination - $120, 30 mins
- Health Checkup - $150, 45 mins

**Food Delivery (2):**
- Premium Food Delivery - $45
- Special Diet Delivery - $65

**Shelter/Boarding (2):**
- Home Boarding - $65/day
- Premium Boarding - $95/day

**Training (2):**
- Professional Training - $90, 60 mins
- Puppy Training - $75, 45 mins

### Pricing Plans (3)

1. **Basic** - $49/month
   - 2 grooming visits/month
   - 4 walk credits
   - Email support
   - 5% delivery discount
   - Basic health tips

2. **Standard** - $89/month (Popular)
   - 4 grooming visits/month
   - 8 walk credits
   - Priority support
   - 10% delivery discount
   - Vet hotline access
   - Training session discount

3. **Premium** - $149/month
   - Unlimited grooming visits
   - Unlimited walk credits
   - 24/7 priority support
   - 20% delivery discount
   - Free vet consultations
   - Free training sessions
   - Boarding priority booking
   - Monthly health reports

### Sample Bookings (10)

Includes bookings with all statuses:
- **New** (3 bookings)
- **Confirmed** (3 bookings)
- **Completed** (3 bookings)
- **Cancelled** (1 booking)

## Troubleshooting

### Migration Errors

**Error: `ER_ACCESS_DENIED_ERROR`**
- Check MySQL credentials in `.env`
- Ensure MySQL user has CREATE DATABASE privileges

**Error: `ECONNREFUSED`**
- Ensure MySQL server is running
- Check host and port in `.env`

### Seeding Errors

**Error: Foreign key constraint fails**
- Run `npm run migrate` first to create tables
- Ensure services are seeded before bookings

**Error: Duplicate entry**
- This is normal - seed script is idempotent
- Existing records will be updated, not duplicated

### Admin Creation Errors

**Error: Email already exists**
- Use `ON DUPLICATE KEY UPDATE` - password will be updated
- Or use a different email address

## Production Notes

1. **Change default admin password** immediately after seeding
2. **Set strong SESSION_SECRET** in production
3. **Use secure MySQL password** (not empty)
4. **Enable MySQL SSL** connections
5. **Set up database backups**
6. **Monitor connection pool** usage
7. **Review indexes** based on query patterns

## File Structure

```
/db
  ├── migrate.js      # Schema creation
  ├── seed.js         # Demo data seeding
  ├── pool.js         # Connection pool
  └── query.js        # Query helpers

/scripts
  └── createAdmin.js  # Admin user creation CLI
```

## Next Steps

After setup:
1. Login at `/admin/login` with seeded admin credentials
2. Review seeded data in admin panel
3. Test booking form submission
4. Customize services and pricing plans as needed

