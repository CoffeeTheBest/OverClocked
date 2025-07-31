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
const { productValidation, handleValidationErrors } = require('../validators/authValidator');

//  Public: Get all products
router.get("/", getAllProducts);

//  Admin-only routes
router.post("/", [verifyToken, verifyAdmin, productValidation, handleValidationErrors], addProduct);
router.put("/:id", [verifyToken, verifyAdmin, productValidation, handleValidationErrors], updateProduct);
router.delete("/:id", [verifyToken, verifyAdmin], deleteProduct);
//  Route to update stock - protected
router.put("/stock/:id", [verifyToken], updateStock);
module.exports = router;
