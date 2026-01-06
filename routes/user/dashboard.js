const express = require('express');
const router = express.Router();
const { requireUserAuth } = require('../../middleware/auth');
const { findAll } = require('../../repositories/bookings');

// GET /dashboard
router.get('/', requireUserAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    
    // Get all bookings for this user
    const allBookings = await findAll({ userId });
    
    // Group bookings by status
    const bookingsByStatus = {
      New: [],
      Confirmed: [],
      Completed: [],
      Cancelled: []
    };
    
    allBookings.forEach(booking => {
      if (bookingsByStatus[booking.status]) {
        bookingsByStatus[booking.status].push(booking);
      }
    });
    
    res.render('user/dashboard', {
      title: 'My Dashboard - Stella Pet Services',
      description: 'View and manage your pet service bookings',
      activeRoute: '/dashboard',
      bookings: allBookings,
      bookingsByStatus,
      userName: req.session.userName,
      userEmail: req.session.userEmail
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'An error occurred while loading your dashboard');
    res.redirect('/');
  }
});

module.exports = router;

