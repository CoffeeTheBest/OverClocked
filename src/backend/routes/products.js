const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} = require("../controllers/productController");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware"); // Import auth

//  Public: Get all products
router.get("/", getAllProducts);

//  Admin-only routes
router.post("/", verifyToken, verifyAdmin, addProduct);
router.put("/:id", verifyToken, verifyAdmin, updateProduct);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);
//  Route to update stock
router.put("/stock/:id", updateStock);
module.exports = router;
