const Product = require("../models/Product");

//  Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

//  Add product
const addProduct = async (req, res) => {
  const { name, category, description, price, quantity } = req.body;

  try {
    const newProduct = await Product.create({
      name,
      category,
      description,
      price,
      quantity,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create product" });
  }
};

//  Update product
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};

//  Delete product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};
const updateStock = async (req, res) => {
  try {
    const { quantityPurchased } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.quantity < quantityPurchased) {
      return res.status(400).json({ msg: "Not enough stock" });
    }

    product.quantity -= quantityPurchased;
    await product.save();

    res.json({ msg: "Stock updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Stock update failed" });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock,
};
