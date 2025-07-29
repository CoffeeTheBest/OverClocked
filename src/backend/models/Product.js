const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [1, 'Product name cannot be empty'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      "laptop",
      "keyboard",
      "mouse",
      "monitor",
      "headset",
      "console",
      "accessory",
      "graphics card",
      "controller",
      "cpu",
      "motherboard",
      "ram",
      "cooling system",
      "pc case",
      "psu",
      "power",
      "storage",
      "streaming gear",
      "gaming chair",
      "vr",
      "networking",
      "capture card",
      "software",
      "bundle",
      "other"
    ]
  },
  brand: { 
    type: String, 
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
    max: [999999.99, 'Price cannot exceed 999,999.99']
  },
  quantity: { 
    type: Number, 
    required: [true, 'Product quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    max: [999999, 'Quantity cannot exceed 999,999']
  },
  specs: { 
    type: String,
    trim: true,
    maxlength: [1000, 'Specifications cannot exceed 1000 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ quantity: 1 });

// Pre-save middleware to sanitize inputs
productSchema.pre('save', function(next) {
  // Sanitize string fields
  if (this.name) this.name = this.name.replace(/[<>]/g, '');
  if (this.description) this.description = this.description.replace(/[<>]/g, '');
  if (this.brand) this.brand = this.brand.replace(/[<>]/g, '');
  if (this.specs) this.specs = this.specs.replace(/[<>]/g, '');
  
  next();
});

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function() {
  return this.quantity > 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.quantity === 0) return 'out_of_stock';
  if (this.quantity <= 5) return 'low_stock';
  return 'in_stock';
});

module.exports = mongoose.model("Product", productSchema);
