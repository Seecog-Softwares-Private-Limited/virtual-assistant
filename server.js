const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const securityMiddleware = require('./middleware/security');
const config = require('./config/env');
const migrate = require('./db/migrate');
const { getPool, closePool } = require('./db/pool');

const app = express();
const PORT = config.port;

// Handlebars configuration
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    eq: function(a, b) {
      return a === b;
    },
    formatPrice: function(price) {
      return `₹${parseFloat(price).toFixed(2)}`;
    },
    add: function(a, b) {
      return parseInt(a) + parseInt(b);
    },
    subtract: function(a, b) {
      return parseInt(a) - parseInt(b);
    },
    currentYear: function() {
      return new Date().getFullYear();
    },
    times: function(n, block) {
      let accum = '';
      for(let i = 0; i < n; ++i) {
        accum += block.fn(i);
      }
      return accum;
    },
    substring: function(str, start, end) {
      return str.substring(start, end);
    },
    json: function(context) {
      return JSON.stringify(context);
    }
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Security middleware
app.use(securityMiddleware);

// Session configuration
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.adminEmail = req.session.adminEmail || null;
  res.locals.userId = req.session.userId || null;
  res.locals.userName = req.session.userName || null;
  res.locals.userEmail = req.session.userEmail || null;
  next();
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public Routes
app.use('/', require('./routes/home'));
app.use('/services', require('./routes/services'));
app.use('/pricing', require('./routes/pricing'));
app.use('/booking', require('./routes/booking'));
app.use('/about', require('./routes/about'));

// User Routes
app.use('/', require('./routes/user/auth'));
app.use('/dashboard', require('./routes/user/dashboard'));

// Admin Routes
app.use('/admin', require('./routes/admin/auth'));
app.use('/admin', require('./routes/admin/dashboard'));
app.use('/admin/services', require('./routes/admin/services'));
app.use('/admin/pricing', require('./routes/admin/pricing'));
app.use('/admin/bookings', require('./routes/admin/bookings'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
    layout: 'main'
  });
});

// Initialize database and start server
async function start() {
  try {
    // Skip migrations if SKIP_MIGRATIONS env var is set (used by startup script)
    if (!process.env.SKIP_MIGRATIONS) {
      // Run migrations
      console.log('🔄 Running database migrations...');
      console.log(`📊 Database: ${config.db.database}@${config.db.host}:${config.db.port}`);
      
      try {
        await migrate();
        console.log('✅ Migrations completed successfully\n');
      } catch (migrationError) {
        console.error('❌ Migration failed:', migrationError.message);
        console.error('Stack:', migrationError.stack);
        console.error('\n⚠️  Please check:');
        console.error('   1. MySQL server is running');
        console.error('   2. Database credentials in .env are correct');
        console.error('   3. User has CREATE DATABASE privileges');
        console.error('\nRun manually: npm run migrate\n');
        throw migrationError;
      }
    } else {
      console.log('⏭️  Skipping migrations (already run by startup script)\n');
    }
    
    // Initialize pool
    try {
      getPool();
      console.log('✅ Database pool initialized\n');
    } catch (poolError) {
      console.error('❌ Failed to initialize database pool:', poolError.message);
      throw poolError;
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Stella Pet Services running on http://localhost:${PORT}`);
      console.log(`📊 Database: ${config.db.database}@${config.db.host}:${config.db.port}\n`);
    });
  } catch (error) {
    console.error('\n❌ Failed to start server:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await closePool();
  process.exit(0);
});

// Start the server
start();

// Export for testing
module.exports = { app };
