const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { findActive, parseIncludes } = require('../repositories/services');
const { create: createBooking } = require('../repositories/bookings');

/**
 * GET – Booking Page
 */
router.get('/', async (req, res) => {
  try {
    const services = await findActive();

    // Normalize services for frontend
    const servicesForView = services.map(service => {
  const parsed = parseIncludes(service);
  return {
    id: parsed.id,
    title: parsed.title,   // ✅ correct column
    includes: parsed.includes || []
  };
});


    res.render('pages/booking', {
      title: 'Hire a Virtual Assistant - VAHub',
      description: 'Tell us your requirements and we’ll match you with the right Virtual Assistant.',
      services: servicesForView,
      activeRoute: '/booking',
      success: false
    });

  } catch (error) {
    console.error('Booking page error:', error);

    res.render('pages/booking', {
      title: 'Hire a Virtual Assistant - VAHub',
      description: 'Tell us your requirements and we’ll match you with the right Virtual Assistant.',
      services: [],
      activeRoute: '/booking',
      success: false,
      error: 'Unable to load services. Please try again.'
    });
  }
});

/**
 * POST – Create Booking
 */
router.post(
  '/',
  [
    body('contactName').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('service').trim().notEmpty().withMessage('Service selection is required'),
    body('preferredDate').notEmpty().withMessage('Start date is required'),
    body('preferredTime').notEmpty().withMessage('Preferred time is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    try {
      const services = await findActive();
      const servicesForView = services.map(service => ({
        id: service.id,
        name: service.name,
        includes: parseIncludes(service).includes || []
      }));

      if (!errors.isEmpty()) {
        return res.render('pages/booking', {
          title: 'Hire a Virtual Assistant - VAHub',
          description: 'Tell us your requirements and we’ll match you with the right Virtual Assistant.',
          services: servicesForView,
          activeRoute: '/booking',
          success: false,
          error: errors.array()[0].msg
        });
      }

      const bookingData = {
        userId: req.session.userId || null,

        // Contact
        customerName: req.body.contactName.trim(),
        email: req.body.email.trim(),
        phone: req.body.phone.trim(),

        // Service
        serviceId: req.body.serviceId ? Number(req.body.serviceId) : null,
        serviceTitle: req.body.service.trim(),
        package: req.body.package || null,

        // Schedule
        preferredDate: req.body.preferredDate,
        preferredTime: req.body.preferredTime,

        // Extra VA details
        workScope: req.body.workScope?.trim() || null,
        notes: req.body.notes?.trim() || null,

        status: 'New'
      };

      const savedBooking = await createBooking(bookingData);

      console.log('📌 New VA Booking:', savedBooking);

      res.render('pages/booking', {
        title: 'Booking Confirmed - VAHub',
        description: 'Your Virtual Assistant request has been successfully submitted.',
        services: servicesForView,
        activeRoute: '/booking',
        success: true,
        booking: savedBooking
      });

    } catch (error) {
      console.error('Booking submission error:', error);

      const services = await findActive().catch(() => []);
      const servicesForView = services.map(service => ({
        id: service.id,
        name: service.name,
        includes: parseIncludes(service).includes || []
      }));

      res.render('pages/booking', {
        title: 'Hire a Virtual Assistant - VAHub',
        description: 'Tell us your requirements and we’ll match you with the right Virtual Assistant.',
        services: servicesForView,
        activeRoute: '/booking',
        success: false,
        error: 'Something went wrong. Please try again.'
      });
    }
  }
);

module.exports = router;
