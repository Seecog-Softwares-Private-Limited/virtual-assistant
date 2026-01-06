// Authentication middleware for admin routes
module.exports = {
  // Check if admin is authenticated
  requireAuth: (req, res, next) => {
    if (req.session && req.session.adminId) {
      return next();
    }
    req.flash('error', 'Please login to access admin area');
    res.redirect('/admin/login');
  },

  // Redirect if admin already authenticated
  redirectIfAuth: (req, res, next) => {
    if (req.session && req.session.adminId) {
      return res.redirect('/admin');
    }
    next();
  },

  // Check if user (customer) is authenticated
  requireUserAuth: (req, res, next) => {
    if (req.session && req.session.userId) {
      return next();
    }
    req.flash('error', 'Please login to access this page');
    res.redirect('/login');
  },

  // Redirect if user already authenticated
  redirectIfUserAuth: (req, res, next) => {
    if (req.session && req.session.userId) {
      return res.redirect('/dashboard');
    }
    next();
  },

  // Optional: Check if user is authenticated (doesn't redirect)
  optionalUserAuth: (req, res, next) => {
    // Just pass through, user info available in res.locals
    next();
  }
};

