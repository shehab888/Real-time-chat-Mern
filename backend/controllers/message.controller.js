
const Message = require('../models/Message');
const Chat = require('../models/Chat');

// GET /api/messages/:chatId
const getChatMessages = async (req, res) => {
  try {
    // Your get chat messages logic here
    // Current user available in req.user from auth middleware
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/messages/:chatId
const sendMessage = async (req, res) => {
  try {
    // Your send message logic here
    // Current user available in req.user from auth middleware
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/messages/:messageId
const editMessage = async (req, res) => {
  try {
    // Your edit message logic here
    // Current user available in req.user from auth middleware
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/messages/:messageId
const deleteMessage = async (req, res) => {
  try {
    // Your delete message logic here
    // Current user available in req.user from auth middleware
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//! methods can be applied in the future

//? POST /api/messages/:messageId/react
// const addReaction = async (req, res) => {
//   try {

    
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//? DELETE /api/messages/:messageId/react
// const removeReaction = async (req, res) => {
//   try {

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// POST /api/messages/:messageId/read
const markMessageAsRead = async (req, res) => {
  try {
    // Your mark message as read logic here
    // Current user available in req.user from auth middleware
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/messages/:chatId/unread-count
const getUnreadCount = async (req, res) => {
  try {
    // Your get unread count logic here
    // Current user available in req.user from auth middleware
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/messages/upload
const uploadFile = async (req, res) => {
  try {
    // Your upload file logic here
    // Current user available in req.user from auth middleware
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChatMessages,
  sendMessage,
  editMessage,
  deleteMessage,
//?   addReaction,
//?   removeReaction,
  markMessageAsRead,
  getUnreadCount,
  uploadFile
};