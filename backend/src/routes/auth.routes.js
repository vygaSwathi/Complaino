const express = require("express");

const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/auth.controller");

const {
  requireAuth,
} = require("../middleware/auth.middleware");

const router = express.Router();

// ========================================
// AUTH ROUTES
// ========================================

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get currently logged-in user's profile
router.get("/me", requireAuth, getMe);

// Logout
router.post("/logout", logout);

module.exports = router;