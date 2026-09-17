const express = require("express");

const {
  getAllUsers,
} = require("../controllers/admin.controller");

const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// Admin can view all users
router.get(
  "/users",
  requireAuth,
  requireRole("admin"),
  getAllUsers
);

module.exports = router;