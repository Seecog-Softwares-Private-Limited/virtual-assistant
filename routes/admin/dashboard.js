const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth');
const { findAll: findAllBookings } = require('../../repositories/bookings');
const { findAll: findAllServices } = require('../../repositories/services');
const { findAll: findAllPricing } = require('../../repositories/pricing');

// GET /admin
router.get('/', requireAuth, async (req, res) => {
  try {
    const bookings = await findAllBookings();
    const services = await findAllServices();
    const plans = await findAllPricing();

    const stats = {
      totalBookings: bookings.length,
      newBookings: bookings.filter(b => b.status === 'New').length,
      totalServices: services.length,
      totalPlans: plans.length
    };

    // Get recent 5 bookings
    const recentBookings = bookings.slice(0, 5);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      layout: 'admin',
      activeRoute: '/admin',
      stats,
      recentBookings,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/admin/login');
  }
});

module.exports = router;

