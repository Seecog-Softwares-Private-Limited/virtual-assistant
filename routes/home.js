const express = require('express');
const router = express.Router();
const { findActive, parseIncludes } = require('../repositories/services');
const testimonials = require('../data/testimonials');

/**
 * GET – Home Page
 */
router.get('/', async (req, res) => {
  try {
    const allServices = await findActive();

    // Show only top services on homepage
    const services = allServices
      .slice(0, 6)
      .map(service => ({
        id: service.id,
        name: service.name,
        category: service.category,
        includes: parseIncludes(service).includes || []
      }));

    res.render('pages/home', {
      title: 'VAHub – Professional Virtual Assistant Services',
      description:
        'Hire skilled virtual assistants for admin support, customer service, marketing, sales, research, and e-commerce tasks.',
      services,
      testimonials,
      activeRoute: '/'
    });

  } catch (error) {
    console.error('Home page error:', error);

    res.render('pages/home', {
      title: 'VAHub – Professional Virtual Assistant Services',
      description:
        'Hire skilled virtual assistants for admin support, customer service, marketing, sales, research, and e-commerce tasks.',
      services: [],
      testimonials,
      activeRoute: '/'
    });
  }
});

module.exports = router;
