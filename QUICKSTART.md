# Quick Start Guide

## 🚀 One-Command Setup (Recommended)

**The fastest way to get started:**

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file** (see Environment Variables section below)

3. **Run everything in one command:**
   ```bash
   npm run start:full
   ```
   
   Or for development mode with auto-reload:
   ```bash
   npm run dev:full
   ```
   
   To also seed demo data:
   ```bash
   npm run start:seed
   # or
   npm run dev:seed
   ```

This single command will:
- ✅ Check for `.env` file
- ✅ Build CSS automatically
- ✅ Create database (if doesn't exist)
- ✅ Create all tables (if don't exist)
- ✅ Optionally seed demo data
- ✅ Start the server

## Manual Setup (Step by Step)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file:
   ```bash
   DB_HOST_STAGE=localhost
   DB_PORT_STAGE=3306
   DB_NAME_STAGE=stella_pet_services
   DB_USER_STAGE=root
   DB_PASSWORD_STAGE=your_password
   SESSION_SECRET=your-secret-key
   PORT=3000
   NODE_ENV=development
   ```

3. **Create database and tables**
   ```bash
   npm run migrate
   ```

4. **Seed demo data (optional)**
   ```bash
   npm run seed
   ```

5. **Build TailwindCSS**
   ```bash
   npm run build:css:prod
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   ```
   http://localhost:3000
   ```

## Development Workflow

For development with auto-reload:

**Terminal 1** - Run the server:
```bash
npm run dev
```

**Terminal 2** - Watch CSS changes:
```bash
npm run build:css
```

## Testing Forms

- **Booking Form**: Navigate to `/booking` and fill out the multi-step form. Submissions are logged to the console.
- **Contact Form**: Navigate to `/about` and scroll to the contact form. Submissions are logged to the console.

## Project Structure Overview

- `server.js` - Main Express server
- `routes/` - Route handlers for each page
- `views/` - Handlebars templates (layouts, partials, pages)
- `data/` - Service data and in-memory storage
- `public/` - Static assets (CSS, JS, images)

## Next Steps

1. Add placeholder images to `public/images/`:
   - `favicon.ico`
   - `og-image.jpg` (1200x630px)
   - `apple-touch-icon.png` (180x180px)

2. Customize content in:
   - `data/services.js` - Service offerings
   - `data/testimonials.js` - Customer testimonials
   - `routes/about.js` - Team members and service areas

3. For production:
   - Set up a database for form submissions
   - Configure environment variables
   - Set up proper image hosting

