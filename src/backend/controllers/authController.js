// Logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.HTTPS === "true",
    sameSite: "strict",
    path: "/"
  });
  // Log logout event
  logAuth('info', `User logged out`, {
    userId: req.user?.id,
    username: req.user?.username || "Unknown user",
    action: "logout"
  });
  res.status(200).json({ msg: "Logged out" });
};
const User = require("../models/User");
const { sign } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const { logger, logAuth, logSecurity } = require('../utils/logger');
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
      logAuth('warn', `Signup failed - weak password`, {
        username: username,
        email: email,
        error: passwordError,
        action: "signup_failed"
      });
      return res.status(400).json({ msg: passwordError });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      logAuth('warn', `Signup failed - user already exists`, {
        username: username,
        email: email,
        action: "signup_failed"
      });
      return res.status(400).json({ msg: "User or email already exists" });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);
    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword, 
      role
    });
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
    logAuth('info', `User signup successful`, {
      userId: user._id,
      username: username,
      email: email,
      role: role,
      action: "signup_success"
    });
    res.status(201).json({ user: { username, email, role } });
  } catch (err) {
    // Log signup failure
    logAuth('error', `Signup failed`, {
      username: username,
      email: email,
      error: err.message,
      action: "signup_failed"
    });
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
      logAuth('warn', `Login failed - user not found`, {
        attemptedUsername: username,
        action: "login_failed"
      });
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if account is locked
    if (user.isLocked) {
      const lockTime = new Date(user.lockUntil).toLocaleString();
      logSecurity('warn', `Login failed - account locked`, {
        userId: user._id,
        username: user.username,
        lockUntil: user.lockUntil,
        action: "login_failed_locked"
      });
      return res.status(423).json({ 
        msg: `Account is temporarily locked due to too many failed attempts. Try again after ${lockTime}` 
      });
    }

    // Compare password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      // Increment failed login attempts
      await user.incLoginAttempts();
      
      logSecurity('warn', `Login failed - invalid password`, {
        userId: user._id,
        username: user.username,
        loginAttempts: user.loginAttempts + 1,
        action: "login_failed_password"
      });
      
      // Check if account should be locked
      if (user.loginAttempts + 1 >= 5) {
        return res.status(423).json({ 
          msg: "Too many failed login attempts. Account locked for 2 hours." 
        });
      }
      
      return res.status(400).json({ 
        msg: `Invalid credentials. ${5 - (user.loginAttempts + 1)} attempts remaining before account lock.` 
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

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
    logAuth('info', `User login successful`, {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      action: "login_success"
    });
    res.json({ user: { username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    // Log login failure
    logAuth('error', `Login failed`, {
      attemptedUsername: username,
      error: err.message,
      action: "login_failed"
    });
    res.status(500).json({ msg: "Login failed" });
  }
};

// Get current user (verify session)
const getCurrentUser = (req, res) => {
  try {
    // req.user is set by verifyToken middleware
    const { id, username, role } = req.user;
    
    // Log session verification
    logAuth('info', `Session verified`, {
      userId: id,
      username: username,
      role: role,
      action: "session_verify"
    });
    res.json({ user: { username, role } });
  } catch (err) {
    userAuthLogger.error(`Get current user failed`, {
      error: err.message,
      action: "session_verify_failed"
    });
    logger.error(`Get current user failed: ${err.message}`);
    res.status(500).json({ msg: "Failed to get current user" });
  }
};

module.exports = { signup, login, logout, getCurrentUser };