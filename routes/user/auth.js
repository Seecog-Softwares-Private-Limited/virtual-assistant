const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { findByEmail, create } = require('../../repositories/users');
const { redirectIfUserAuth, requireUserAuth } = require('../../middleware/auth');

// Rate limiting for login and register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /login
router.get('/login', redirectIfUserAuth, (req, res) => {
  res.render('user/login', {
    title: 'Login - Stella Pet Services',
    description: 'Login to your account to view your bookings',
    activeRoute: '/login',
    error: req.flash('error'),
    success: req.flash('success')
  });
});

// POST /login
router.post('/login', 
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
      const user = await findByEmail(email);
      
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isValid) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
      }

      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userName = user.name;
      
      req.flash('success', 'Login successful');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      req.flash('error', 'An error occurred during login');
      res.redirect('/login');
    }
  }
);

// GET /register
router.get('/register', redirectIfUserAuth, (req, res) => {
  res.render('user/register', {
    title: 'Register - Stella Pet Services',
    description: 'Create an account to manage your pet service bookings',
    activeRoute: '/register',
    error: req.flash('error'),
    success: req.flash('success')
  });
});

// POST /register
router.post('/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/register');
    }

    const { name, email, phone, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await findByEmail(email);
      if (existingUser) {
        req.flash('error', 'Email already registered');
        return res.redirect('/register');
      }

      // Create user
      const user = await create({ name, email, phone, password });
      
      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userName = user.name;
      
      req.flash('success', 'Registration successful! Welcome to Stella Pet Services');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      req.flash('error', 'An error occurred during registration');
      res.redirect('/register');
    }
  }
);

// POST /logout
router.post('/logout', requireUserAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;

