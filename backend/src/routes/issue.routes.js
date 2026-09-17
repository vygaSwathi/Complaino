const express = require("express");

const {
  createIssue,
  getMyIssues,
  getAllIssues,
  updateIssueStatus,
} = require("../controllers/issue.controller");

const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// Student creates an issue
router.post(
  "/",
  requireAuth,
  requireRole("student"),
  createIssue
);

// Student gets only their own issues
router.get(
  "/my",
  requireAuth,
  requireRole("student"),
  getMyIssues
);

// Council and admin get all issues
router.get(
  "/",
  requireAuth,
  requireRole("council", "admin"),
  getAllIssues
);

// Council and admin update issue status
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("council", "admin"),
  updateIssueStatus
);

module.exports = router;