const express = require('express');
const router = express.Router();
const { findAll, parseIncludes } = require('../repositories/services');

const categories = ['All', 'Admin & Operations', 'Customer & Sales', 'Marketing & Growth', 'Finance & HR', 'Tech & Automation', 'Personal Assistance'];

router.get('/', async (req, res) => {
  try {
    const category = req.query.category || 'All';
    let services = await findAll();
    
    // Parse includes_json
    services = services.map(parseIncludes);
    
    // Filter by category
    if (category !== 'All') {
  services = services.filter(
    s => s.category === category);
}

    res.render('pages/services', {
      title: 'Our Services - Virtual Assistant',
      description: 'Tell us your requirements and we’ll match you with the right Virtual Assistant.',
      services,
      categories,
      activeCategory: category,
      activeRoute: '/services'
    });
  } catch (error) {
    console.error('Services page error:', error);
    res.render('pages/services', {
      title: 'Our Services - Virtual Assistant',
      description: 'Tell us your requirements and we’ll match you with the right Virtual Assistant.',
      services: [],
      categories,
      activeCategory: 'All',
      activeRoute: '/services'
    });
  }
});



// router.get('/', async (req, res) => {
//   try {
//     let category = req.query.category || 'All';
//     let services = await findAll();

//     services = services.map(parseIncludes);

//     // 🔥 NORMALIZE OLD CATEGORIES → NEW UI CATEGORIES
//     services = services.map(s => {
//       if (['Administrative'].includes(s.category)) {
//         s.category = 'Admin & Operations';
//       }
//       if (['Customer Support', 'Sales'].includes(s.category)) {
//         s.category = 'Customer & Sales';
//       }
//       if (['Marketing', 'Research', 'E-commerce'].includes(s.category)) {
//         s.category = 'Marketing & Growth';
//       }
//       if (['Finance', 'HR'].includes(s.category)) {
//         s.category = 'Finance & HR';
//       }
//       if (['Tech'].includes(s.category)) {
//         s.category = 'Tech & Automation';
//       }
//       return s;
//     });

//     // ✅ FILTER
//     if (category !== 'All') {
//   services = services.filter(
//     s => s.category?.trim() === category?.trim()
//   );
// }

//     res.render('pages/services', {
//       title: 'Our Services - Virtual Assistant',
//       services,
//       categories,
//       activeCategory: category,
//       activeRoute: '/services'
//     });
//   } catch (err) {
//     console.error(err);
//     res.render('pages/services', {
//       services: [],
//       categories,
//       activeCategory: 'All'
//     });
//   }
// });


module.exports = router;
