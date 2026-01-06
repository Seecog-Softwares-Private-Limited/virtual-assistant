const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { findByEmail } = require('../../repositories/admins');
const { requireAuth, redirectIfAuth } = require('../../middleware/auth');

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /admin/login
router.get('/login', redirectIfAuth, (req, res) => {
  res.render('admin/login', {
    title: 'Admin Login',
    layout: 'admin',
    hideNav: true,
    error: req.flash('error'),
    success: req.flash('success')
  });
});

// POST /admin/login
router.post('/login', 
  loginLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/admin/login');
    }

    const { email, password } = req.body;

    try {
      const admin = await findByEmail(email);
      
      if (!admin) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('/admin/login');
      }

      const isValid = await bcrypt.compare(password, admin.password_hash);
      
      if (!isValid) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('/admin/login');
      }

      // Set session
      req.session.adminId = admin.id;
      req.session.adminEmail = admin.email;
      
      req.flash('success', 'Login successful');
      res.redirect('/admin');
    } catch (error) {
      console.error('Login error:', error);
      req.flash('error', 'An error occurred during login');
      res.redirect('/admin/login');
    }
  }
);

// POST /admin/logout
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/admin/login');
  });
});

module.exports = router;

