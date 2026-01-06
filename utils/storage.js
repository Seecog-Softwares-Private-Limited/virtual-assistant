const fs = require('fs').promises;
const path = require('path');

// Base storage directory
const DATA_DIR = path.join(__dirname, '..', 'data');

// Generic file operations
async function readFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [];
    }
    throw error;
  }
}

async function writeFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Admin operations
async function getAdmins() {
  return readFile('admins.json');
}

async function saveAdmins(admins) {
  return writeFile('admins.json', admins);
}

async function findAdminByUsername(username) {
  const admins = await getAdmins();
  return admins.find(a => a.username === username);
}

async function findAdminById(id) {
  const admins = await getAdmins();
  return admins.find(a => a.id === parseInt(id));
}

// Bookings operations
async function getBookings() {
  return readFile('bookings.json');
}

async function saveBookings(bookings) {
  return writeFile('bookings.json', bookings);
}

async function getBookingById(id) {
  const bookings = await getBookings();
  return bookings.find(b => b.id === parseInt(id));
}

async function createBooking(booking) {
  const bookings = await getBookings();
  const newBooking = {
    ...booking,
    id: Date.now(),
    status: 'New',
    createdAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  await saveBookings(bookings);
  return newBooking;
}

async function updateBooking(id, updates) {
  const bookings = await getBookings();
  const index = bookings.findIndex(b => b.id === parseInt(id));
  if (index === -1) return null;
  
  bookings[index] = { ...bookings[index], ...updates, updatedAt: new Date().toISOString() };
  await saveBookings(bookings);
  return bookings[index];
}

async function deleteBooking(id) {
  const bookings = await getBookings();
  const filtered = bookings.filter(b => b.id !== parseInt(id));
  await saveBookings(filtered);
  return filtered.length !== bookings.length;
}

// Services operations
async function getServices() {
  return readFile('services.json');
}

async function saveServices(services) {
  return writeFile('services.json', services);
}

async function getServiceById(id) {
  const services = await getServices();
  return services.find(s => s.id === parseInt(id));
}

async function createService(service) {
  const services = await getServices();
  const newService = {
    ...service,
    id: Date.now(),
    isActive: service.isActive !== undefined ? service.isActive : true,
    createdAt: new Date().toISOString()
  };
  services.push(newService);
  await saveServices(services);
  return newService;
}

async function updateService(id, updates) {
  const services = await getServices();
  const index = services.findIndex(s => s.id === parseInt(id));
  if (index === -1) return null;
  
  services[index] = { ...services[index], ...updates, updatedAt: new Date().toISOString() };
  await saveServices(services);
  return services[index];
}

async function deleteService(id) {
  const services = await getServices();
  const filtered = services.filter(s => s.id !== parseInt(id));
  await saveServices(filtered);
  return filtered.length !== services.length;
}

// Pricing operations
async function getPricingPlans() {
  return readFile('pricing.json');
}

async function savePricingPlans(plans) {
  return writeFile('pricing.json', plans);
}

async function getPricingPlanById(id) {
  const plans = await getPricingPlans();
  return plans.find(p => p.id === parseInt(id));
}

async function createPricingPlan(plan) {
  const plans = await getPricingPlans();
  const newPlan = {
    ...plan,
    id: Date.now(),
    isActive: plan.isActive !== undefined ? plan.isActive : true,
    createdAt: new Date().toISOString()
  };
  plans.push(newPlan);
  await savePricingPlans(plans);
  return newPlan;
}

async function updatePricingPlan(id, updates) {
  const plans = await getPricingPlans();
  const index = plans.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;
  
  plans[index] = { ...plans[index], ...updates, updatedAt: new Date().toISOString() };
  await savePricingPlans(plans);
  return plans[index];
}

async function deletePricingPlan(id) {
  const plans = await getPricingPlans();
  const filtered = plans.filter(p => p.id !== parseInt(id));
  await savePricingPlans(filtered);
  return filtered.length !== plans.length;
}

module.exports = {
  // Admin
  getAdmins,
  saveAdmins,
  findAdminByUsername,
  findAdminById,
  
  // Bookings
  getBookings,
  saveBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  
  // Services
  getServices,
  saveServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  
  // Pricing
  getPricingPlans,
  savePricingPlans,
  getPricingPlanById,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan
};

