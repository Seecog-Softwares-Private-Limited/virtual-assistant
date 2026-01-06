const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { findActive, parseIncludes } = require('../repositories/services');
const { create: createBooking } = require('../repositories/bookings');

router.get('/', async (req, res) => {
  try {
    const services = await findActive();
    const servicesWithIncludes = services.map(parseIncludes);
    
    res.render('pages/booking', {
      title: 'Book a Service - Stella Pet Services',
      description: 'Book your pet care service with Stella. Choose from grooming, walking, vaccination, and more.',
      services: servicesWithIncludes,
      activeRoute: '/booking',
      success: false
    });
  } catch (error) {
    console.error('Booking page error:', error);
    res.render('pages/booking', {
      title: 'Book a Service - Stella Pet Services',
      description: 'Book your pet care service with Stella.',
      services: [],
      activeRoute: '/booking',
      success: false,
      error: 'Error loading services'
    });
  }
});

router.post('/',
  [
    body('contactName').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('petName').trim().notEmpty().withMessage('Pet name is required'),
    body('petBreed').trim().notEmpty().withMessage('Pet breed is required'),
    body('petAge').trim().notEmpty().withMessage('Pet age is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('zipCode').trim().notEmpty().withMessage('ZIP code is required'),
    body('preferredDate').isISO8601().withMessage('Valid date is required'),
    body('preferredTime').trim().notEmpty().withMessage('Time is required'),
    body('service').trim().notEmpty().withMessage('Service is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    
    try {
      const services = await findActive();
      const servicesWithIncludes = services.map(parseIncludes);
      
      if (!errors.isEmpty()) {
        return res.render('pages/booking', {
          title: 'Book a Service - Stella Pet Services',
          description: 'Book your pet care service with Stella.',
          services: servicesWithIncludes,
          activeRoute: '/booking',
          success: false,
          error: errors.array()[0].msg
        });
      }

      const bookingData = {
        userId: req.session.userId || null, // Associate with logged-in user if available
        customerName: req.body.contactName.trim(),
        phone: req.body.phone.trim(),
        email: req.body.email.trim(),
        address: req.body.address.trim(),
        addressLine2: req.body.addressLine2?.trim() || null,
        city: req.body.city.trim(),
        state: req.body.state?.trim() || '',
        zipCode: req.body.zipCode.trim(),
        serviceId: req.body.serviceId ? parseInt(req.body.serviceId, 10) : null,
        serviceTitle: req.body.service.trim(),
        preferredDate: req.body.preferredDate,
        preferredTime: req.body.preferredTime.trim(),
        petType: req.body.petType?.trim() || null,
        petBreed: req.body.petBreed.trim(),
        petAge: req.body.petAge.trim(),
        notes: req.body.notes?.trim() || null,
        status: 'New'
      };

      const savedBooking = await createBooking(bookingData);
      console.log('📅 New Booking:', JSON.stringify(savedBooking, null, 2));

      res.render('pages/booking', {
        title: 'Booking Confirmed - Stella Pet Services',
        description: 'Your booking has been confirmed.',
        services: servicesWithIncludes,
        activeRoute: '/booking',
        success: true,
        booking: savedBooking
      });
    } catch (error) {
      console.error('Booking error:', error);
      const services = await findActive().catch(() => []);
      const servicesWithIncludes = services.map(parseIncludes);
      
      res.render('pages/booking', {
        title: 'Book a Service - Stella Pet Services',
        description: 'Book your pet care service with Stella.',
        services: servicesWithIncludes,
        activeRoute: '/booking',
        success: false,
        error: 'An error occurred. Please try again.'
      });
    }
  }
);

module.exports = router;
