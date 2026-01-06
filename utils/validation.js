// Validation utilities for admin forms

function validateService(data) {
  const errors = [];
  
  if (!data.category || data.category.trim() === '') {
    errors.push('Category is required');
  }
  
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!data.description || data.description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (!data.durationMins || isNaN(data.durationMins) || parseInt(data.durationMins) <= 0) {
    errors.push('Duration must be a positive number');
  }
  
  if (!data.startingPrice || isNaN(data.startingPrice) || parseFloat(data.startingPrice) < 0) {
    errors.push('Starting price must be a valid number');
  }
  
  if (!Array.isArray(data.includes)) {
    errors.push('Includes must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function validatePricingPlan(data) {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Plan name is required');
  }
  
  if (!data.priceMonthly || isNaN(data.priceMonthly) || parseFloat(data.priceMonthly) < 0) {
    errors.push('Monthly price must be a valid number');
  }
  
  if (!Array.isArray(data.features)) {
    errors.push('Features must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
}

function sanitizeObject(obj) {
  const sanitized = {};
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      sanitized[key] = obj[key].map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeInput(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
}

module.exports = {
  validateService,
  validatePricingPlan,
  sanitizeInput,
  sanitizeObject
};

