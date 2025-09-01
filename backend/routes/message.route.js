// routes/message.routes.js
const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message.controller");
const Auth = require("../middlewares/Auth");

// ✅ Protect all routes with Auth middleware
router.use(Auth);

// Get all messages in a chat (with pagination)
router.get("/:chatId", messageController.getChatMessages);

// Send a new message
router.post("/:chatId", messageController.sendMessage);

// Edit a message
router.put("/:messageId", messageController.editMessage);

// Delete a message
router.delete("/:messageId", messageController.deleteMessage);

// Mark a single message as read
router.post("/:messageId/read", messageController.markMessageAsRead);

// Get unread count for a chat
router.get("/:chatId/unread-count", messageController.getUnreadCount);

// Upload file (placeholder for now)
router.post("/upload", messageController.uploadFile);

// Mark all messages in a chat as read
router.post("/:chatId/mark-as-read", messageController.markChatAsRead);

// Typing status
router.post("/:chatId/typing", messageController.handleTyping);

module.exports = router;
