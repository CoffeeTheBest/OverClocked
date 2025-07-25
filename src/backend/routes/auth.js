const express = require("express");
const router = express.Router();

const { signup, login, logout } = require("../controllers/authController");
const { signupValidation, loginValidation, handleValidationErrors } = require('../validators/authValidator');

// POST /api/auth/signup
router.post("/signup", signupValidation, handleValidationErrors, signup);

// POST /api/auth/login
router.post("/login", loginValidation, handleValidationErrors, login);

// POST /api/auth/logout
router.post("/logout", logout);

module.exports = router;
