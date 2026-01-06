const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../../middleware/auth');
const {
  findPaginated,
  findById,
  update,
  remove,
  getStatusCounts
} = require('../../repositories/bookings');

// GET /admin/bookings
router.get('/', requireAuth, async (req, res) => {
  try {
    const { search, status, page } = req.query;
    const currentPage = parseInt(page || 1, 10);
    
    const filters = {
      search: search || '',
      status: status || 'all'
    };
    
    const result = await findPaginated(filters, currentPage, 20);
    const statusCounts = await getStatusCounts();
    
    res.render('admin/bookings/index', {
      title: 'Manage Bookings',
      layout: 'admin',
      activeRoute: '/admin/bookings',
      bookings: result.bookings,
      search: filters.search,
      status: filters.status,
      statusCounts,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        total: result.total,
        hasNext: result.page < result.totalPages,
        hasPrev: result.page > 1
      },
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Bookings list error:', error);
    req.flash('error', 'Error loading bookings');
    res.redirect('/admin');
  }
});

// GET /admin/bookings/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const booking = await findById(req.params.id);
    if (!booking) {
      req.flash('error', 'Booking not found');
      return res.redirect('/admin/bookings');
    }

    res.render('admin/bookings/detail', {
      title: 'Booking Details',
      layout: 'admin',
      booking,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Booking detail error:', error);
    req.flash('error', 'Error loading booking');
    res.redirect('/admin/bookings');
  }
});

// POST /admin/bookings/:id/status
router.post('/:id/status',
  requireAuth,
  [
    body('status').isIn(['New', 'Confirmed', 'Completed', 'Cancelled']).withMessage('Invalid status')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect(`/admin/bookings/${req.params.id}`);
    }

    try {
      const { status } = req.body;
      const updated = await update(req.params.id, { status });
      if (!updated) {
        req.flash('error', 'Booking not found');
        return res.redirect('/admin/bookings');
      }

      req.flash('success', 'Booking status updated');
      res.redirect(`/admin/bookings/${req.params.id}`);
    } catch (error) {
      console.error('Update booking status error:', error);
      req.flash('error', 'Error updating booking status');
      res.redirect(`/admin/bookings/${req.params.id}`);
    }
  }
);

// POST /admin/bookings/:id/delete
router.post('/:id/delete', requireAuth, async (req, res) => {
  try {
    const deleted = await remove(req.params.id);
    if (deleted) {
      req.flash('success', 'Booking deleted successfully');
    } else {
      req.flash('error', 'Booking not found');
    }
    res.redirect('/admin/bookings');
  } catch (error) {
    console.error('Delete booking error:', error);
    req.flash('error', 'Error deleting booking');
    res.redirect('/admin/bookings');
  }
});

module.exports = router;
