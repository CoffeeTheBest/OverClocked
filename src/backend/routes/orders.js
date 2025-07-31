const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  createPaymentIntent,
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');

// Create payment intent
router.post('/payment-intent', [verifyToken], createPaymentIntent);

// Create order
router.post('/', [verifyToken], createOrder);

// Get user orders
router.get('/my-orders', [verifyToken], getUserOrders);

// Get order by ID
router.get('/:id', [verifyToken], getOrderById);

// Update order status (admin only)
router.patch('/:id/status', [verifyToken], updateOrderStatus);

module.exports = router; 