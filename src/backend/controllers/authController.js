// Logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.HTTPS === "true",
    sameSite: "strict",
    path: "/"
  });
  // Log logout event
  console.log(`[AUTH] Logout: ${req.user ? req.user.username : "Unknown user"}`);
  res.status(200).json({ msg: "Logged out" });
};
const User = require("../models/User");
const { sign } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const logger = require('../utils/logger');
const { validatePassword } = require('../utils/passwordValidator');

//  Generate token
const generateToken = (user) => {
  // Only include non-sensitive info in payload
  // TODO: Rotate JWT signing keys periodically (update JWT_SECRET and notify clients)
  // TODO: Implement token revocation/blacklist for compromised tokens
  return sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
      // iss: process.env.JWT_ISSUER, // Uncomment if using issuer
      // aud: process.env.JWT_AUDIENCE, // Uncomment if using audience
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
      // issuer: process.env.JWT_ISSUER, // Uncomment if using issuer
      // audience: process.env.JWT_AUDIENCE, // Uncomment if using audience
    }
  );
};

//  Signup
const signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      logger.warn(`Signup failed - weak password for ${username}: ${passwordError}`);
      return res.status(400).json({ msg: passwordError });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      logger.warn(`Signup failed - user already exists: ${username} or ${email}`);
      return res.status(400).json({ msg: "User or email already exists" });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });
    const token = generateToken(user);

    // Set secure HttpOnly cookie with SameSite strict
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.HTTPS === "true", // Set to true in production
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/"
    });
    // TODO: Implement token revocation/blacklist for logout and compromised tokens

    // Log signup event
    logger.info(`Successful signup: ${username} (${email}) as ${role}`);
    console.log(`[AUTH] Signup: ${username} (${email}) as ${role}`);
    res.status(201).json({ user: { username, email, role } });
  } catch (err) {
    // Log signup failure
    logger.error(`Signup failed for ${username}: ${err.message}`);
    console.error(`[AUTH] Signup failed for ${username}:`, err);
    res.status(500).json({ msg: "Signup failed" });
  }
};

//  Login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Allow login by username or email
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user) {
      logger.warn(`Login failed - user not found: ${username}`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed - invalid password for: ${user.username}`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user);

    // Set secure HttpOnly cookie with SameSite strict
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.HTTPS === "true", // Set to true in production
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/"
    });
    // TODO: Implement token revocation/blacklist for logout and compromised tokens

    // Log login event
    logger.info(`Successful login: ${user.username} (${user.email}) as ${user.role}`);
    console.log(`[AUTH] Login: ${user.username} (${user.email}) as ${user.role}`);
    res.json({ user: { username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    // Log login failure
    logger.error(`Login failed for ${username}: ${err.message}`);
    console.error(`[AUTH] Login failed for ${username}:`, err);
    res.status(500).json({ msg: "Login failed" });
  }
};

module.exports = { signup, login, logout };