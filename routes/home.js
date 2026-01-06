const express = require('express');
const router = express.Router();
const { findActive, parseIncludes } = require('../repositories/services');
const testimonials = require('../data/testimonials');

router.get('/', async (req, res) => {
  try {
    const allServices = await findActive();
    const services = allServices.slice(0, 6).map(parseIncludes);
    
    res.render('pages/home', {
      title: 'Stella Pet Services - Premium At-Home Pet Care',
      description: 'Professional pet grooming, walking, vaccination, food delivery, boarding, and training services at your home.',
      services,
      testimonials,
      activeRoute: '/'
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.render('pages/home', {
      title: 'Stella Pet Services - Premium At-Home Pet Care',
      description: 'Professional pet grooming, walking, vaccination, food delivery, boarding, and training services at your home.',
      services: [],
      testimonials,
      activeRoute: '/'
    });
  }
});

module.exports = router;

