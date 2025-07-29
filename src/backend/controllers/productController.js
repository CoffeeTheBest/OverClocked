const Product = require("../models/Product");
const logger = require('../utils/logger');

//  Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select('-__v');
    logger.info(`Products retrieved successfully - Count: ${products.length}`);
    res.json(products);
  } catch (err) {
    logger.error(`Error retrieving products: ${err.message}`);
    res.status(500).json({ msg: "Server error" });
  }
};

//  Add product
const addProduct = async (req, res) => {
  const { name, category, description, price, quantity, brand, specs } = req.body;

  try {
    // Validate required fields
    if (!name || !category || !description || price === undefined || quantity === undefined) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Validate price and quantity
    if (price < 0 || quantity < 0) {
      return res.status(400).json({ msg: "Price and quantity must be non-negative" });
    }

    const newProduct = await Product.create({
      name,
      category,
      description,
      price,
      quantity,
      brand,
      specs,
      createdBy: req.user.id,
      lastModifiedBy: req.user.id
    });

    logger.info(`Product created: ${name} by user ${req.user.username}`);
    res.status(201).json(newProduct);
  } catch (err) {
    logger.error(`Product creation failed: ${err.message}`);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: "Failed to create product" });
  }
};

//  Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate product ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: "Invalid product ID format" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Validate input data
    const { price, quantity } = req.body;
    if (price !== undefined && price < 0) {
      return res.status(400).json({ msg: "Price cannot be negative" });
    }
    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({ msg: "Quantity cannot be negative" });
    }

    const updated = await Product.findByIdAndUpdate(
      id, 
      { 
        ...req.body, 
        lastModifiedBy: req.user.id 
      }, 
      { 
        new: true, 
        runValidators: true 
      }
    );

    logger.info(`Product updated: ${updated.name} by user ${req.user.username}`);
    res.json(updated);
  } catch (err) {
    logger.error(`Product update failed: ${err.message}`);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: "Update failed" });
  }
};

//  Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate product ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: "Invalid product ID format" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    await Product.findByIdAndDelete(id);
    
    logger.info(`Product deleted: ${product.name} by user ${req.user.username}`);
    res.json({ msg: "Product deleted" });
  } catch (err) {
    logger.error(`Product deletion failed: ${err.message}`);
    res.status(500).json({ msg: "Delete failed" });
  }
};

const updateStock = async (req, res) => {
  try {
    const { quantityPurchased } = req.body;
    const productId = req.params.id;
    
    // Validate input
    if (!quantityPurchased || quantityPurchased <= 0) {
      return res.status(400).json({ msg: "Invalid quantity specified" });
    }
    
    // Validate product ID format
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: "Invalid product ID format" });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.quantity < quantityPurchased) {
      return res.status(400).json({ 
        msg: `Not enough stock. Available: ${product.quantity}, Requested: ${quantityPurchased}` 
      });
    }

    // Use findByIdAndUpdate to avoid validation issues with required fields
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        quantity: product.quantity - quantityPurchased,
        lastModifiedBy: req.user.id
      },
      {
        new: true,
        runValidators: false // Skip validation for stock updates
      }
    );
    
    logger.info(`Stock updated for ${updatedProduct.name}: ${quantityPurchased} units sold by user ${req.user.username}`);
    res.json({ msg: "Stock updated", product: updatedProduct });
  } catch (err) {
    logger.error(`Stock update error for product ${req.params.id}: ${err.message}`);
    
    // More specific error messages
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: "Invalid product ID" });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: `Validation error: ${err.message}` });
    }
    if (err.name === 'MongoTimeoutError' || err.name === 'MongoNetworkError') {
      return res.status(503).json({ msg: "Database connection error. Please try again." });
    }
    
    res.status(500).json({ msg: `Stock update failed: ${err.message}` });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock,
};
