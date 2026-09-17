const { z } = require("zod");
const ChatMessage = require("../models/Chat");

const messageSchema = z.object({
  message: z.string().trim().min(1).max(2000),
});

/* ========================================
   STUDENT SEND MESSAGE
======================================== */

const sendStudentMessage = async (req, res) => {
  try {
    const result = messageSchema.safeParse(
      req.body
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid message",
      });
    }

    const chatMessage =
      await ChatMessage.create({
        studentId: req.user.id,
        sender: "student",
        message: result.data.message,
        isRead: false,
      });

    return res.status(201).json({
      success: true,
      message: "Message sent",
      chat: {
        id: chatMessage._id,
        sender: chatMessage.sender,
        message: chatMessage.message,
        createdAt: chatMessage.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Send student message error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/* ========================================
   STUDENT GET OWN CHAT
======================================== */

const getMyChat = async (req, res) => {
  try {
    const messages =
      await ChatMessage.find({
        studentId: req.user.id,
      })
        .sort({ createdAt: 1 })
        .select(
          "sender message isRead createdAt updatedAt"
        );

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(
      "Get student chat error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/* ========================================
   ADMIN GET ALL CHATS
======================================== */

const getAllChats = async (req, res) => {
  try {
    const messages =
      await ChatMessage.find()
        .sort({ createdAt: 1 })
        .populate(
          "studentId",
          "name email"
        );

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(
      "Get all chats error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/* ========================================
   ADMIN SEND MESSAGE
======================================== */

const sendAdminMessage = async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = messageSchema.safeParse(
      req.body
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid message",
      });
    }

    const chatMessage =
      await ChatMessage.create({
        studentId,
        sender: "admin",
        message: result.data.message,

        /*
          Admin's own message is already read
          by the admin.
        */
        isRead: true,
      });

    return res.status(201).json({
      success: true,
      message: "Reply sent",
      chat: {
        id: chatMessage._id,
        sender: chatMessage.sender,
        message: chatMessage.message,
        createdAt: chatMessage.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Send admin message error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/* ========================================
   MARK STUDENT CHAT AS READ
======================================== */

const markChatAsRead = async (req, res) => {
  try {
    const { studentId } = req.params;

    await ChatMessage.updateMany(
      {
        studentId,
        sender: "student",
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Chat marked as read",
    });
  } catch (error) {
    console.error(
      "Mark chat as read error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  sendStudentMessage,
  getMyChat,
  getAllChats,
  sendAdminMessage,
  markChatAsRead,
};