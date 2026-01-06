# Admin Module Documentation

## Overview

The admin module provides a complete authentication and content management system for Stella Pet Services. It includes protected routes, session management, and CRUD operations for services, pricing plans, and bookings.

## Features

- ✅ Secure authentication with bcrypt password hashing
- ✅ Session-based authentication with express-session
- ✅ Rate limiting on login attempts
- ✅ Protected admin routes
- ✅ Dashboard with statistics
- ✅ Services CRUD (Create, Read, Update, Delete)
- ✅ Pricing Plans CRUD
- ✅ Bookings management (view, filter, update status, delete)
- ✅ Search and filter functionality
- ✅ Pagination for bookings
- ✅ Premium admin UI matching site design

## Initial Setup

### 1. Create Admin User

Run the initialization script to create your first admin user:

```bash
npm run init-admin [username] [password]
```

Example:
```bash
npm run init-admin admin admin123
```

If no arguments are provided, defaults to:
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the default password in production!

### 2. Access Admin Panel

1. Start the server: `npm run dev`
2. Navigate to: `http://localhost:3000/admin/login`
3. Login with your credentials

## Admin Routes

### Authentication
- `GET /admin/login` - Login page
- `POST /admin/login` - Login handler (rate limited: 5 attempts per 15 minutes)
- `POST /admin/logout` - Logout handler

### Dashboard
- `GET /admin` - Dashboard overview with statistics

### Services Management
- `GET /admin/services` - List all services
- `GET /admin/services/new` - Create new service form
- `POST /admin/services` - Create service handler
- `GET /admin/services/:id/edit` - Edit service form
- `POST /admin/services/:id` - Update service handler
- `POST /admin/services/:id/delete` - Delete service handler

### Pricing Management
- `GET /admin/pricing` - List all pricing plans
- `GET /admin/pricing/new` - Create new plan form
- `POST /admin/pricing` - Create plan handler
- `GET /admin/pricing/:id/edit` - Edit plan form
- `POST /admin/pricing/:id` - Update plan handler
- `POST /admin/pricing/:id/delete` - Delete plan handler

### Bookings Management
- `GET /admin/bookings` - List bookings with search/filter
- `GET /admin/bookings/:id` - View booking details
- `POST /admin/bookings/:id/status` - Update booking status
- `POST /admin/bookings/:id/delete` - Delete booking

## Data Storage

All data is stored in JSON files in the `/data` directory:

- `admins.json` - Admin user accounts
- `bookings.json` - Customer bookings
- `services.json` - Service offerings
- `pricing.json` - Pricing plans

### Data Structure

**Service:**
```json
{
  "id": 1,
  "category": "Grooming",
  "title": "Professional Grooming",
  "description": "...",
  "durationMins": 120,
  "startingPrice": 75,
  "includes": ["Bath & dry", "Haircut"],
  "isActive": true,
  "sortOrder": 1
}
```

**Pricing Plan:**
```json
{
  "id": 1,
  "name": "Silver",
  "priceMonthly": 49,
  "features": ["2 grooming visits/month"],
  "isPopular": false,
  "isActive": true,
  "sortOrder": 1
}
```

**Booking:**
```json
{
  "id": 1234567890,
  "status": "New",
  "service": "grooming",
  "contactName": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "petName": "Max",
  "petBreed": "Golden Retriever",
  "petAge": "3 years",
  "preferredDate": "2024-01-15",
  "preferredTime": "10:00",
  "address": "123 Main St",
  "city": "San Francisco",
  "zipCode": "94102"
}
```

## Security Features

1. **Password Hashing**: Uses bcrypt with salt rounds (10)
2. **Session Security**: 
   - HttpOnly cookies
   - Secure cookies in production
   - 24-hour session expiration
3. **Rate Limiting**: Login attempts limited to 5 per 15 minutes
4. **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
5. **Input Sanitization**: Basic XSS protection on form inputs
6. **Protected Routes**: All admin routes require authentication

## Environment Variables

For production, set these environment variables:

```bash
SESSION_SECRET=your-secret-key-here
NODE_ENV=production
PORT=3000
```

## Migrating to Database

The code is designed to be easily migrated to a database. The storage utilities in `/utils/storage.js` can be replaced with database queries while keeping the same function signatures.

Example migration pattern:
```javascript
// Instead of:
const services = await getServices();

// Use:
const services = await db.query('SELECT * FROM services');
```

## Troubleshooting

### Can't login
- Verify admin user exists: Check `data/admins.json`
- Reset password: Run `npm run init-admin admin newpassword`
- Check server logs for errors

### Bookings not saving
- Ensure `data/bookings.json` exists and is writable
- Check file permissions
- Review server logs for errors

### Session not persisting
- Check cookie settings in `server.js`
- Verify `SESSION_SECRET` is set
- Clear browser cookies and try again

## Production Checklist

- [ ] Change default admin password
- [ ] Set strong `SESSION_SECRET` environment variable
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Set `NODE_ENV=production`
- [ ] Review and adjust rate limiting thresholds
- [ ] Set up proper file permissions for data directory
- [ ] Implement database backup strategy
- [ ] Add monitoring and logging
- [ ] Review security headers
- [ ] Test all CRUD operations

