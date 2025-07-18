const express = require("express");
const router = express.Router();

const { signup, login, logout } = require("../controllers/authController");

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

module.exports = router;
