const { body, validationResult } = require('express-validator');

const signupValidation = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3-20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];

const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const productValidation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name is required and must be less than 100 characters'),
  
  body('category')
    .isIn([
      'laptop', 'keyboard', 'mouse', 'monitor', 'headset', 'console', 
      'accessory', 'graphics card', 'controller', 'cpu', 'motherboard', 
      'ram', 'cooling system', 'pc case', 'psu', 'storage', 'streaming gear', 
      'gaming chair', 'vr', 'networking', 'capture card', 'software', 'bundle', 'other'
    ])
    .withMessage('Invalid product category'),
  
  body('description')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10-500 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  signupValidation,
  loginValidation,
  productValidation,
  handleValidationErrors
};
