#!/usr/bin/env node

/**
 * Comprehensive startup script that:
 * 1. Builds CSS (if needed)
 * 2. Creates database and tables (if they don't exist)
 * 3. Optionally seeds data
 * 4. Starts the server
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '..', 'properties.env');
  const altEnvPath = path.join(__dirname, '..', '.env');
  
  const envFile = fs.existsSync(envPath) ? envPath : altEnvPath;
  const envFileName = fs.existsSync(envPath) ? 'properties.env' : '.env';
  
  if (!fs.existsSync(envPath) && !fs.existsSync(altEnvPath)) {
    log('\n❌ Environment file not found!', 'red');
    log('Please create properties.env or .env file with the following variables:', 'yellow');
    log('\n# For STAGING/DEVELOPMENT:');
    log('DB_HOST_STAGE=localhost');
    log('DB_PORT_STAGE=3306');
    log('DB_NAME_STAGE=stella_pet_services_stage');
    log('DB_USER_STAGE=root');
    log('DB_PASSWORD_STAGE=your_password');
    log('\n# For PRODUCTION:');
    log('DB_HOST_PROD=your-production-host.com');
    log('DB_PORT_PROD=3306');
    log('DB_NAME_PROD=stella_pet_services_prod');
    log('DB_USER_PROD=your_prod_user');
    log('DB_PASSWORD_PROD=your_production_password');
    log('\n# Application Config:');
    log('SESSION_SECRET=your-secret-key');
    log('PORT=3000');
    log('NODE_ENV=development\n', 'yellow');
    log('💡 See ENV_CONFIG_GUIDE.md for complete configuration guide\n', 'cyan');
    process.exit(1);
  }
  log(`✅ Environment file found: ${envFileName}`, 'green');
}

function buildCSS() {
  log('\n📦 Building CSS...', 'cyan');
  try {
    const cssOutputPath = path.join(__dirname, '..', 'public', 'css', 'output.css');
    
    // Check if CSS output exists and is recent
    if (fs.existsSync(cssOutputPath)) {
      const stats = fs.statSync(cssOutputPath);
      const cssInputPath = path.join(__dirname, '..', 'public', 'css', 'input.css');
      
      // If input.css is newer than output.css, rebuild
      if (fs.existsSync(cssInputPath)) {
        const inputStats = fs.statSync(cssInputPath);
        if (inputStats.mtime <= stats.mtime) {
          log('✅ CSS is up to date', 'green');
          return;
        }
      }
    }
    
    // Build CSS for production
    execSync('npm run build:css:prod', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    log('✅ CSS built successfully', 'green');
  } catch (error) {
    log('⚠️  CSS build failed, but continuing...', 'yellow');
    log(`   Error: ${error.message}`, 'yellow');
  }
}

function runMigrations() {
  log('\n🔄 Running database migrations...', 'cyan');
  try {
    execSync('npm run migrate', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    log('✅ Database and tables ready', 'green');
  } catch (error) {
    log('\n❌ Migration failed!', 'red');
    log('Please check:', 'yellow');
    log('  1. MySQL server is running', 'yellow');
    log('  2. Database credentials in .env are correct', 'yellow');
    log('  3. User has CREATE DATABASE privileges', 'yellow');
    process.exit(1);
  }
}

function seedData() {
  // Check if SEED_DATA env var is set, or if --seed flag is passed
  const shouldSeed = process.env.SEED_DATA === 'true' || 
                     process.argv.includes('--seed') ||
                     process.argv.includes('-s');
  
  if (shouldSeed) {
    log('\n🌱 Seeding database with demo data...', 'cyan');
    try {
      execSync('npm run seed', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      log('✅ Database seeded successfully', 'green');
    } catch (error) {
      log('⚠️  Seeding failed, but continuing...', 'yellow');
      log(`   Error: ${error.message}`, 'yellow');
    }
  } else {
    log('\n💡 Skipping data seeding (use --seed flag to seed)', 'yellow');
  }
}

function startServer() {
  log('\n🚀 Starting server...', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  
  // Check if dev mode
  const isDev = process.argv.includes('--dev') || 
                process.argv.includes('-d') ||
                process.env.NODE_ENV === 'development';
  
  // Set environment variable to skip migrations (already run above)
  const env = { ...process.env, SKIP_MIGRATIONS: 'true' };
  
  const command = isDev ? 'npm run dev' : 'npm start';
  
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      env: env
    });
  } catch (error) {
    // This will be caught when user stops the server (Ctrl+C)
    log('\n👋 Server stopped', 'yellow');
    process.exit(0);
  }
}

// Main execution
async function main() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'cyan');
  log('║     Stella Pet Services - Startup Script             ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════╝', 'cyan');
  
  // Step 1: Check .env file
  checkEnvFile();
  
  // Step 2: Build CSS
  buildCSS();
  
  // Step 3: Run migrations (creates DB + tables)
  runMigrations();
  
  // Step 4: Seed data (optional)
  seedData();
  
  // Step 5: Start server
  startServer();
}

// Handle errors
process.on('uncaughtException', (error) => {
  log('\n❌ Uncaught error:', 'red');
  log(error.message, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  log('\n❌ Unhandled rejection:', 'red');
  log(error.message, 'red');
  process.exit(1);
});

// Run main function
main();

