const Message = require('../models/message.model');
const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const { emitToChat, emitToUser } = require('../utils/socketslogic');
const { SOCKET_EVENTS } = require('../utils/socketEvents');

// GET /api/messages/:chatId
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Verify user is participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const isParticipant = chat.participants.includes(userId);
    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get messages with pagination (newest first)
    const messages = await Message.find({ 
      chat: chatId,
      isDeleted: false 
    })
      .populate('sender', 'username profilePicture isOnline')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean(); //Returns plain JavaScript objects instead of full Mongoose documents → faster and lighter response.

    // Reverse to show oldest first in the response
    messages.reverse();

    res.status(200).json({
      success: true,
      messages,
      pagination: {
        currentPage: page,
        hasMore: messages.length === parseInt(limit)
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/messages/:chatId
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = 'text' } = req.body;
    const userId = req.user._id;

    // Verify user is participant in the chat
    const chat = await Chat.findById(chatId).populate('participants', 'username profilePicture isOnline');
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const isParticipant = chat.participants.some(p => p._id.toString() === userId.toString());
    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if only admins can send messages in group chat
    if (chat.isGroupChat && chat.chatSettings?.allowOnlyAdminsToSend) {
      const isAdmin = chat.groupAdmins.includes(userId) || chat.groupOwner.toString() === userId.toString();
      if (!isAdmin) {
        return res.status(403).json({ error: 'Only admins can send messages in this chat' });
      }
    }

    // Validate content based on message type
    if (messageType === 'text' && (!content || content.trim() === '')) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Create the message
    const newMessage = new Message({
      sender: userId,
      chat: chatId,
      content: content?.trim(),
      messageType
    });

    await newMessage.save();

    // Update chat's latest message
    chat.latestMessage = newMessage._id;
    await chat.save();

    // Populate sender details for the response
    await newMessage.populate('sender', 'username profilePicture isOnline');

    // Emit to all chat participants
    emitToChat(chatId, SOCKET_EVENTS.NEW_MESSAGE, {
      message: newMessage,
      chatId
    }, [userId]); // Exclude sender

    // Update chat list for all participants
    emitToChat(chatId, SOCKET_EVENTS.CHAT_UPDATED, {
      chatId,
      latestMessage: newMessage,
      updatedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/messages/:messageId
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Find the message
    const message = await Message.findById(messageId).populate('sender', 'username profilePicture');
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.isDeleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Verify user is the sender
    if (message.sender._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You can only edit your own messages' });
    }

    // Check if message is text type
    if (message.messageType !== 'text') {
      return res.status(400).json({ error: 'Only text messages can be edited' });
    }

    // Update the message
    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    // Emit to all chat participants
    emitToChat(message.chat, SOCKET_EVENTS.MESSAGE_EDITED, {
      messageId: message._id,
      content: message.content,
      isEdited: true,
      editedAt: message.editedAt
    });

    res.status(200).json({
      success: true,
      message
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/messages/:messageId
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.isDeleted) {
      return res.status(404).json({ error: 'Message already deleted' });
    }

    // Verify user is the sender or chat admin/owner
    const chat = await Chat.findById(message.chat);
    const isSender = message.sender.toString() === userId.toString();
    const isGroupOwner = chat.groupOwner?.toString() === userId.toString();
    const isGroupAdmin = chat.groupAdmins?.includes(userId);

    if (!isSender && !isGroupOwner && !isGroupAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Soft delete the message
    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    // If this was the latest message, update chat's latest message
    if (chat.latestMessage?.toString() === messageId) {
      const latestMessage = await Message.findOne({
        chat: chat._id,
        isDeleted: false
      }).sort({ createdAt: -1 });
      
      chat.latestMessage = latestMessage?._id || null;
      await chat.save();
    }

    // Emit to all chat participants
    emitToChat(message.chat, SOCKET_EVENTS.MESSAGE_DELETED, {
      messageId: message._id,
      chatId: message.chat
    });

    // If latest message changed, update chat list
    if (chat.latestMessage?.toString() !== messageId) {
      emitToChat(message.chat, SOCKET_EVENTS.CHAT_UPDATED, {
        chatId: chat._id,
        latestMessage: await Message.findById(chat.latestMessage).populate('sender', 'username'),
        updatedAt: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/messages/:messageId/read
const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is participant in the chat
    const chat = await Chat.findById(message.chat);
    const isParticipant = chat.participants.some(p => p.toString() === userId.toString());

    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if already read by this user
    const alreadyRead = message.readBy.some(read => read.user.toString() === userId.toString());
    if (alreadyRead) {
      return res.status(200).json({ 
        success: true, 
        message: 'Message already marked as read' 
      });
    }

    // Don't mark own messages as read
    if (message.sender.toString() === userId.toString()) {
      return res.status(200).json({ 
        success: true, 
        message: 'Cannot mark own message as read' 
      });
    }

    // Add read status
    message.readBy.push({
      user: userId,
      readAt: new Date()
    });
    await message.save();

    // Emit read receipt to message sender
    emitToUser(message.sender, SOCKET_EVENTS.MESSAGE_READ, {
      messageId: message._id,
      readBy: userId,
      readAt: new Date(),
      chatId: message.chat
    });

    res.status(200).json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/messages/:chatId/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Verify user is participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const isParticipant = chat.participants.includes(userId);
    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Count unread messages (messages not sent by user and not read by user)
    const unreadCount = await Message.countDocuments({
      chat: chatId,
      sender: { $ne: userId }, // Not sent by current user
      isDeleted: false,
      readBy: { $not: { $elemMatch: { user: userId } } } // Not read by current user
    });

    res.status(200).json({
      success: true,
      unreadCount,
      chatId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/messages/upload
const uploadFile = async (req, res) => {
  try {
    // This would typically handle file upload to cloud storage
    // For now, returning a placeholder implementation
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Here you would upload to cloud storage (AWS S3, Cloudinary, etc.)
    // and return the file URL
    
    const fileUrl = `uploads/${req.file.filename}`; // Placeholder
    
    res.status(200).json({
      success: true,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to mark all messages as read in a chat
const markChatAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Verify user is participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const isParticipant = chat.participants.includes(userId);
    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get all unread messages in the chat
    const unreadMessages = await Message.find({
      chat: chatId,
      sender: { $ne: userId },
      isDeleted: false,
      readBy: { $not: { $elemMatch: { user: userId } } }
    });

    // Mark all as read
    const updatePromises = unreadMessages.map(message => {
      message.readBy.push({
        user: userId,
        readAt: new Date()
      });
      return message.save();
    });

    await Promise.all(updatePromises);

    // Emit read receipts for all messages
    unreadMessages.forEach(message => {
      emitToUser(message.sender, SOCKET_EVENTS.MESSAGE_READ, {
        messageId: message._id,
        readBy: userId,
        readAt: new Date(),
        chatId: message.chat
      });
    });

    res.status(200).json({
      success: true,
      message: `Marked ${unreadMessages.length} messages as read`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to get typing status
const handleTyping = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { isTyping } = req.body;
    const userId = req.user._id;

    // Verify user is participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const isParticipant = chat.participants.includes(userId);
    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Emit typing status to other participants
    const eventType = isTyping ? SOCKET_EVENTS.USER_TYPING : SOCKET_EVENTS.USER_STOPPED_TYPING;
    emitToChat(chatId, eventType, {
      userId,
      username: req.user.username,
      chatId
    }, [userId]); // Exclude the typing user from receiving the event

    res.status(200).json({
      success: true,
      message: 'Typing status updated'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChatMessages,// done
  sendMessage,// done
  editMessage,// done 
  deleteMessage,//done
  markMessageAsRead,
  getUnreadCount,
  uploadFile,// in progress needs cloud
  markChatAsRead,
  handleTyping //done
};