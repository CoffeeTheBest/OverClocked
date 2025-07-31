const express = require("express");
const router = express.Router();

const { signup, login, logout, getCurrentUser } = require("../controllers/authController");
const { signupValidation, loginValidation, handleValidationErrors } = require('../validators/authValidator');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/signup
router.post("/signup", [signupValidation, handleValidationErrors], signup);

// POST /api/auth/login
router.post("/login", [loginValidation, handleValidationErrors], login);

// POST /api/auth/logout
router.post("/logout", logout);

// GET /api/auth/me - Get current user
router.get("/me", [verifyToken], getCurrentUser);

module.exports = router;
