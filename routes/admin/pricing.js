const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../../middleware/auth');
const {
  findAll,
  findById,
  create,
  update,
  remove,
  parseFeatures
} = require('../../repositories/pricing');

// GET /admin/pricing
router.get('/', requireAuth, async (req, res) => {
  try {
    const plans = await findAll();
    // Parse features_json for each plan
    const plansWithFeatures = plans.map(parseFeatures);
    
    res.render('admin/pricing/index', {
      title: 'Manage Pricing',
      layout: 'admin',
      activeRoute: '/admin/pricing',
      plans: plansWithFeatures,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Pricing list error:', error);
    req.flash('error', 'Error loading pricing plans');
    res.redirect('/admin');
  }
});

// GET /admin/pricing/new
router.get('/new', requireAuth, (req, res) => {
  res.render('admin/pricing/form', {
    title: 'New Pricing Plan',
    layout: 'admin',
    plan: null,
    error: req.flash('error'),
    success: req.flash('success')
  });
});

// POST /admin/pricing
router.post('/',
  requireAuth,
  [
    body('name').trim().notEmpty().withMessage('Plan name is required'),
    body('priceMonthly').isFloat({ min: 0 }).withMessage('Monthly price must be a valid number')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/admin/pricing/new');
    }

    try {
      // Convert features string to array
      let features = [];
      if (typeof req.body.features === 'string') {
        features = req.body.features.split('\n').map(f => f.trim()).filter(f => f);
      } else if (Array.isArray(req.body.features)) {
        features = req.body.features.filter(f => f.trim());
      }

      const planData = {
        name: req.body.name.trim(),
        priceMonthly: parseFloat(req.body.priceMonthly),
        features,
        isPopular: req.body.isPopular === 'on',
        isActive: req.body.isActive === 'on',
        sortOrder: parseInt(req.body.sortOrder || 0, 10)
      };

      await create(planData);
      req.flash('success', 'Pricing plan created successfully');
      res.redirect('/admin/pricing');
    } catch (error) {
      console.error('Create pricing error:', error);
      req.flash('error', 'Error creating pricing plan');
      res.redirect('/admin/pricing/new');
    }
  }
);

// GET /admin/pricing/:id/edit
router.get('/:id/edit', requireAuth, async (req, res) => {
  try {
    const plan = await findById(req.params.id);
    if (!plan) {
      req.flash('error', 'Pricing plan not found');
      return res.redirect('/admin/pricing');
    }

    const planWithFeatures = parseFeatures(plan);

    res.render('admin/pricing/form', {
      title: 'Edit Pricing Plan',
      layout: 'admin',
      plan: planWithFeatures,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Edit pricing error:', error);
    req.flash('error', 'Error loading pricing plan');
    res.redirect('/admin/pricing');
  }
});

// POST /admin/pricing/:id
router.post('/:id',
  requireAuth,
  [
    body('name').trim().notEmpty().withMessage('Plan name is required'),
    body('priceMonthly').isFloat({ min: 0 }).withMessage('Monthly price must be a valid number')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect(`/admin/pricing/${req.params.id}/edit`);
    }

    try {
      // Convert features string to array
      let features = [];
      if (typeof req.body.features === 'string') {
        features = req.body.features.split('\n').map(f => f.trim()).filter(f => f);
      } else if (Array.isArray(req.body.features)) {
        features = req.body.features.filter(f => f.trim());
      }

      const planData = {
        name: req.body.name.trim(),
        priceMonthly: parseFloat(req.body.priceMonthly),
        features,
        isPopular: req.body.isPopular === 'on',
        isActive: req.body.isActive === 'on',
        sortOrder: parseInt(req.body.sortOrder || 0, 10)
      };

      const updated = await update(req.params.id, planData);
      if (!updated) {
        req.flash('error', 'Pricing plan not found');
        return res.redirect('/admin/pricing');
      }

      req.flash('success', 'Pricing plan updated successfully');
      res.redirect('/admin/pricing');
    } catch (error) {
      console.error('Update pricing error:', error);
      req.flash('error', 'Error updating pricing plan');
      res.redirect(`/admin/pricing/${req.params.id}/edit`);
    }
  }
);

// POST /admin/pricing/:id/delete
router.post('/:id/delete', requireAuth, async (req, res) => {
  try {
    const deleted = await remove(req.params.id);
    if (deleted) {
      req.flash('success', 'Pricing plan deleted successfully');
    } else {
      req.flash('error', 'Pricing plan not found');
    }
    res.redirect('/admin/pricing');
  } catch (error) {
    console.error('Delete pricing error:', error);
    req.flash('error', 'Error deleting pricing plan');
    res.redirect('/admin/pricing');
  }
});

module.exports = router;
