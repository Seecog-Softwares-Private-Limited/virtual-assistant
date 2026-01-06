const express = require('express');
const router = express.Router();
const { findActive, parseFeatures } = require('../repositories/pricing');

const addOns = [
  { name: 'Tick & Flea Treatment', price: 25 },
  { name: 'De-shedding Treatment', price: 30 },
  { name: 'Nail Trim Only', price: 15 },
  { name: 'Pickup & Drop Service', price: 20 }
];

router.get('/', async (req, res) => {
  try {
    const plans = await findActive();
    // Parse features_json and map to expected format
    const packages = plans.map(plan => {
      const planWithFeatures = parseFeatures(plan);
      return {
        name: planWithFeatures.name,
        price: parseFloat(planWithFeatures.price_monthly),
        period: 'month',
        description: planWithFeatures.description || '',
        features: planWithFeatures.features || [],
        popular: planWithFeatures.is_popular === 1
      };
    });

    res.render('pages/pricing', {
      title: 'Packages & Pricing - Stella Pet Services',
      description: 'Choose the perfect pet care package for your needs. Silver, Gold, and Platinum plans available.',
      packages,
      addOns,
      activeRoute: '/pricing'
    });
  } catch (error) {
    console.error('Pricing page error:', error);
    res.render('pages/pricing', {
      title: 'Packages & Pricing - Stella Pet Services',
      description: 'Choose the perfect pet care package for your needs.',
      packages: [],
      addOns,
      activeRoute: '/pricing'
    });
  }
});

module.exports = router;
