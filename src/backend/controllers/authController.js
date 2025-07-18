// Logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.HTTPS === "true",
    sameSite: "strict",
    path: "/"
  });
  res.status(200).json({ msg: "Logged out" });
};
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//  Generate token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

//  Signup
const signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ msg: "User or email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });
    const token = generateToken(user);

    // Set secure HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.HTTPS === "true",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.status(201).json({ user: { username, email, role } });
  } catch (err) {
    res.status(500).json({ msg: "Signup failed" });
  }
};

//  Login
const login = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user);

    // Set secure HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.HTTPS === "true",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.json({ user: { username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
};

module.exports = { signup, login, logout };