// Load environment variables from .env or properties.env
const fs = require('fs');
const path = require('path');

// Try to load properties.env first, then fall back to .env
const envFile = fs.existsSync(path.join(__dirname, '..', 'properties.env'))
  ? path.join(__dirname, '..', 'properties.env')
  : path.join(__dirname, '..', '.env');

require('dotenv').config({ path: envFile });

// Determine environment (production, staging, or development)
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const isStaging = nodeEnv === 'staging';

// Select environment prefix based on NODE_ENV
const envPrefix = isProduction ? 'PROD' : 'STAGE';

// Build variable names based on environment
const getEnvVar = (baseName) => {
  const envVar = `${baseName}_${envPrefix}`;
  return process.env[envVar];
};

// Required variables for current environment
const requiredVars = [
  `DB_HOST_${envPrefix}`,
  `DB_PORT_${envPrefix}`,
  `DB_NAME_${envPrefix}`,
  `DB_USER_${envPrefix}`,
  `DB_PASSWORD_${envPrefix}`
];

// Validate required environment variables
const missing = requiredVars.filter(v => {
  const value = process.env[v];
  // Allow empty string for password, but not undefined/null
  if (v.includes('PASSWORD')) {
    return value === undefined || value === null;
  }
  return !value || value.trim() === '';
});

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables for ${nodeEnv.toUpperCase()} environment:`);
  console.error('   ', missing.join(', '));
  console.error(`\n📋 Please create properties.env or .env file in the project root with:`);
  console.error('\n# For STAGING/DEVELOPMENT:');
  console.error('DB_HOST_STAGE=localhost');
  console.error('DB_PORT_STAGE=3306');
  console.error('DB_NAME_STAGE=stella_pet_services_stage');
  console.error('DB_USER_STAGE=root');
  console.error('DB_PASSWORD_STAGE=');
  console.error('\n# For PRODUCTION:');
  console.error('DB_HOST_PROD=your-production-host.com');
  console.error('DB_PORT_PROD=3306');
  console.error('DB_NAME_PROD=stella_pet_services_prod');
  console.error('DB_USER_PROD=your_prod_user');
  console.error('DB_PASSWORD_PROD=your_production_password');
  console.error('\n# Set environment:');
  console.error('NODE_ENV=production  # or staging or development');
  console.error('\n💡 See ENV_CONFIG_GUIDE.md for complete configuration guide\n');
  process.exit(1);
}

// Get database configuration based on environment
const dbConfig = {
  host: getEnvVar('DB_HOST'),
  port: parseInt(getEnvVar('DB_PORT'), 10),
  database: getEnvVar('DB_NAME'),
  user: getEnvVar('DB_USER'),
  password: getEnvVar('DB_PASSWORD') || '',
  waitForConnections: true,
  connectionLimit: isProduction ? 20 : 10,
  enableKeepAlive: true,
  queueLimit: 0
};

// Log current environment configuration
console.log(`\n📊 Environment: ${nodeEnv.toUpperCase()}`);
console.log(`📊 Database: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`);

module.exports = {
  db: dbConfig,
  session: {
    secret: process.env.SESSION_SECRET || 'stella-pet-services-secret-key-change-in-production'
  },
  port: parseInt(process.env.PORT || 3000, 10),
  nodeEnv: nodeEnv,
  isProduction: isProduction,
  isStaging: isStaging,
  isDevelopment: !isProduction && !isStaging
};

