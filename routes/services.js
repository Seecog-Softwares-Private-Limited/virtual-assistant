const express = require('express');
const router = express.Router();
const { findAll, parseIncludes } = require('../repositories/services');

const categories = ['All', 'Grooming', 'Walking', 'Vet/Vaccination', 'Food Delivery', 'Shelter/Boarding', 'Training'];

router.get('/', async (req, res) => {
  try {
    const category = req.query.category || 'All';
    let services = await findAll();
    
    // Parse includes_json
    services = services.map(parseIncludes);
    
    // Filter by category
    if (category !== 'All') {
      services = services.filter(s => s.category === category);
    }

    res.render('pages/services', {
      title: 'Our Services - Stella Pet Services',
      description: 'Browse our comprehensive pet care services including grooming, walking, vaccination, food delivery, boarding, and training.',
      services,
      categories,
      activeCategory: category,
      activeRoute: '/services'
    });
  } catch (error) {
    console.error('Services page error:', error);
    res.render('pages/services', {
      title: 'Our Services - Stella Pet Services',
      description: 'Browse our comprehensive pet care services.',
      services: [],
      categories,
      activeCategory: 'All',
      activeRoute: '/services'
    });
  }
});

module.exports = router;
