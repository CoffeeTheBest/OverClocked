const Order = require("../models/Order");
const Product = require("../models/Product");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { 
  logger, 
  logPayment, 
  logOrder, 
  logError 
} = require('../utils/logger');

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        userId: req.user.id,
        username: req.user.username
      }
    });

    logPayment('info', `Payment intent created for user ${req.user.username}`, {
      paymentIntentId: paymentIntent.id,
      userId: req.user.id,
      amount: amount,
      currency: currency
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error('Stripe error:', err);
    
    // Log the error with more details
    logPayment('error', `Payment intent creation failed`, {
      error: err.message,
      errorType: err.type,
      errorCode: err.code,
      userId: req.user?.id,
      amount: amount
    });
    
    // Provide more specific error messages based on Stripe error types
    let errorMessage = "Failed to create payment intent";
    
    if (err.type === 'StripeAuthenticationError') {
      errorMessage = "Payment service configuration error";
    } else if (err.type === 'StripeInvalidRequestError') {
      errorMessage = "Invalid payment request";
    } else if (err.type === 'StripeAPIError') {
      errorMessage = "Payment service temporarily unavailable";
    } else if (err.type === 'StripeConnectionError') {
      errorMessage = "Unable to connect to payment service";
    } else if (err.code === 'card_declined') {
      errorMessage = "Payment method was declined";
    } else if (err.code === 'insufficient_funds') {
      errorMessage = "Insufficient funds";
    }
    
    res.status(500).json({ 
      msg: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const { items, total, paymentIntentId, shippingAddress } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "Invalid items" });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ msg: "Invalid total amount" });
    }

    if (!paymentIntentId) {
      return res.status(400).json({ msg: "Payment intent ID is required" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ msg: "Shipping address is required" });
    }

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ msg: "Payment not completed" });
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: items.map(item => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total,
      paymentIntentId,
      shippingAddress,
      status: 'paid'
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item._id,
        { $inc: { quantity: -item.quantity } }
      );
    }

    logOrder('info', `Order created successfully`, {
      orderId: order._id,
      userId: req.user.id,
      username: req.user.username,
      total: total,
      itemCount: items.length,
      paymentIntentId: paymentIntentId
    });
    res.status(201).json(order);
  } catch (err) {
    logOrder('error', `Order creation failed`, {
      error: err.message,
      errorType: err.name,
      userId: req.user?.id,
      username: req.user?.username
    });
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: "Failed to create order" });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    logOrder('info', `Orders retrieved for user`, {
      userId: req.user.id,
      username: req.user.username,
      orderCount: orders.length
    });
    res.json(orders);
  } catch (err) {
    logOrder('error', `Error retrieving orders`, {
      error: err.message,
      userId: req.user?.id
    });
    res.status(500).json({ msg: "Server error" });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: "Invalid order ID format" });
    }

    const order = await Order.findById(id)
      .populate('items.product', 'name price')
      .populate('user', 'username email');

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Check if user is authorized to view this order
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    logOrder('error', `Error retrieving order`, {
      error: err.message,
      orderId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({ msg: "Server error" });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: "Invalid order ID format" });
    }

    if (!['pending', 'paid', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    order.status = status;
    await order.save();

    logOrder('info', `Order status updated`, {
      orderId: order._id,
      newStatus: status,
      updatedBy: req.user.username,
      userId: req.user.id
    });
    res.json(order);
  } catch (err) {
    logOrder('error', `Order status update failed`, {
      error: err.message,
      orderId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({ msg: "Failed to update order status" });
  }
};

module.exports = {
  createPaymentIntent,
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
}; 