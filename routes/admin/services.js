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
  parseIncludes
} = require('../../repositories/services');

// GET /admin/services
router.get('/', requireAuth, async (req, res) => {
  try {
    const services = await findAll();
    // Parse includes_json for each service
    const servicesWithIncludes = services.map(parseIncludes);
    
    res.render('admin/services/index', {
      title: 'Manage Services',
      layout: 'admin',
      activeRoute: '/admin/services',
      services: servicesWithIncludes,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Services list error:', error);
    req.flash('error', 'Error loading services');
    res.redirect('/admin');
  }
});

// GET /admin/services/new
router.get('/new', requireAuth, (req, res) => {
  res.render('admin/services/form', {
    title: 'New Service',
    layout: 'admin',
    service: null,
    error: req.flash('error'),
    success: req.flash('success')
  });
});

// POST /admin/services
router.post('/', 
  requireAuth,
  [
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('durationMins').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
    body('startingPrice').isFloat({ min: 0 }).withMessage('Starting price must be a valid number')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/admin/services/new');
    }

    try {
      // Convert includes string to array
      let includes = [];
      if (typeof req.body.includes === 'string') {
        includes = req.body.includes.split('\n').map(i => i.trim()).filter(i => i);
      } else if (Array.isArray(req.body.includes)) {
        includes = req.body.includes.filter(i => i.trim());
      }

      const serviceData = {
        category: req.body.category.trim(),
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        durationMins: parseInt(req.body.durationMins, 10),
        startingPrice: parseFloat(req.body.startingPrice),
        includes,
        isActive: req.body.isActive === 'on',
        sortOrder: parseInt(req.body.sortOrder || 0, 10)
      };

      await create(serviceData);
      req.flash('success', 'Service created successfully');
      res.redirect('/admin/services');
    } catch (error) {
      console.error('Create service error:', error);
      req.flash('error', 'Error creating service');
      res.redirect('/admin/services/new');
    }
  }
);

// GET /admin/services/:id/edit
router.get('/:id/edit', requireAuth, async (req, res) => {
  try {
    const service = await findById(req.params.id);
    if (!service) {
      req.flash('error', 'Service not found');
      return res.redirect('/admin/services');
    }

    const serviceWithIncludes = parseIncludes(service);

    res.render('admin/services/form', {
      title: 'Edit Service',
      layout: 'admin',
      service: serviceWithIncludes,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.error('Edit service error:', error);
    req.flash('error', 'Error loading service');
    res.redirect('/admin/services');
  }
});

// POST /admin/services/:id
router.post('/:id',
  requireAuth,
  [
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('durationMins').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
    body('startingPrice').isFloat({ min: 0 }).withMessage('Starting price must be a valid number')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect(`/admin/services/${req.params.id}/edit`);
    }

    try {
      // Convert includes string to array
      let includes = [];
      if (typeof req.body.includes === 'string') {
        includes = req.body.includes.split('\n').map(i => i.trim()).filter(i => i);
      } else if (Array.isArray(req.body.includes)) {
        includes = req.body.includes.filter(i => i.trim());
      }

      const serviceData = {
        category: req.body.category.trim(),
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        durationMins: parseInt(req.body.durationMins, 10),
        startingPrice: parseFloat(req.body.startingPrice),
        includes,
        isActive: req.body.isActive === 'on',
        sortOrder: parseInt(req.body.sortOrder || 0, 10)
      };

      const updated = await update(req.params.id, serviceData);
      if (!updated) {
        req.flash('error', 'Service not found');
        return res.redirect('/admin/services');
      }

      req.flash('success', 'Service updated successfully');
      res.redirect('/admin/services');
    } catch (error) {
      console.error('Update service error:', error);
      req.flash('error', 'Error updating service');
      res.redirect(`/admin/services/${req.params.id}/edit`);
    }
  }
);

// POST /admin/services/:id/delete
router.post('/:id/delete', requireAuth, async (req, res) => {
  try {
    const deleted = await remove(req.params.id);
    if (deleted) {
      req.flash('success', 'Service deleted successfully');
    } else {
      req.flash('error', 'Service not found');
    }
    res.redirect('/admin/services');
  } catch (error) {
    console.error('Delete service error:', error);
    req.flash('error', 'Error deleting service');
    res.redirect('/admin/services');
  }
});

module.exports = router;
