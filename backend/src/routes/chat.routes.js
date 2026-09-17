const express = require("express");

const {
  sendStudentMessage,
  getMyChat,
  getAllChats,
  sendAdminMessage,
  markChatAsRead,
} = require("../controllers/chat.controller");

const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

/* ========================================
   STUDENT CHAT
======================================== */

/*
  Student sends a message
*/
router.post(
  "/message",
  requireAuth,
  requireRole("student"),
  sendStudentMessage
);

/*
  Student gets their own chat
*/
router.get(
  "/my",
  requireAuth,
  requireRole("student"),
  getMyChat
);


/* ========================================
   ADMIN CHAT
======================================== */

/*
  Admin gets all conversations
*/
router.get(
  "/admin",
  requireAuth,
  requireRole("admin"),
  getAllChats
);

/*
  Admin replies to a student
*/
router.post(
  "/admin/:studentId",
  requireAuth,
  requireRole("admin"),
  sendAdminMessage
);

/*
  Admin marks student's messages as read
*/
router.patch(
  "/admin/:studentId/read",
  requireAuth,
  requireRole("admin"),
  markChatAsRead
);


module.exports = router;