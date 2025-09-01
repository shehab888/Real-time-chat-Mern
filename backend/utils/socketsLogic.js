// utils/socketslogic.js
const Chat = require('../models/chat.model');

// Store connected users and their socket IDs
const connectedUsers = new Map(); // userId -> Set of socketIds
const socketToUser = new Map(); // socketId -> userId

// Initialize socket connection
const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

      // Handle user authentication and registration
    socket.on("authenticate", async (data) => {
      try {
        const { token } = data;
        if (!token) {
          return socket.emit("error", { message: "No token provided" });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded || !decoded._id) {
          return socket.emit("error", { message: "Invalid token" });
        }

        // Ensure user exists in DB
        const user = await User.findById(decoded._id);
        if (!user) {
          return socket.emit("error", { message: "User not found" });
        }

        const userId = user._id.toString();
        // Store user connection
        if (!connectedUsers.has(userId)) {
          connectedUsers.set(userId, new Set());
        }
        connectedUsers.get(userId).add(socket.id);
        socketToUser.set(socket.id, userId);
        
        // Join user to their chat rooms
        const userChats = await Chat.find({ participants: userId }).select('_id');
        userChats.forEach(chat => {
          socket.join(chat._id.toString());
        });
        
        // Notify others that user is online
        socket.broadcast.emit('user_online', { userId });
        
        console.log(`User ${userId} authenticated with socket ${socket.id}`);
        
      } catch (error) {
        socket.emit('error', { message: 'Authentication failed' });
      }
    });

    // Handle joining specific chat rooms
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    // Handle leaving specific chat rooms
    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId);
      console.log(`Socket ${socket.id} left chat ${chatId}`);
    });

    // Handle typing events
    socket.on('typing', (data) => {
      const { chatId, isTyping } = data;
      const userId = socketToUser.get(socket.id);
      
      if (userId) {
        socket.to(chatId).emit(isTyping ? 'user_typing' : 'user_stopped_typing', {
          userId,
          chatId
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const userId = socketToUser.get(socket.id);
      
      if (userId) {
        // Remove socket from user's connections
        const userSockets = connectedUsers.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          
          // If user has no more connections, mark as offline
          if (userSockets.size === 0) {
            connectedUsers.delete(userId);
            socket.broadcast.emit('user_offline', { userId });
            console.log(`User ${userId} went offline`);
          }
        }
        
        socketToUser.delete(socket.id);
      }
      
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

// Emit to all participants in a chat
const emitToChat = (chatId, event, data, excludeUsers = []) => {
  const io = global.io; // Assuming io is stored globally
  if (!io) return;

  // Convert excludeUsers to strings for comparison
  const excludeUserIds = excludeUsers.map(id => id.toString());
  
  // Get all sockets in the chat room
  const room = io.sockets.adapter.rooms.get(chatId.toString());
  if (!room) return;

  room.forEach(socketId => {
    const userId = socketToUser.get(socketId);
    if (userId && !excludeUserIds.includes(userId.toString())) {
      io.to(socketId).emit(event, data);
    }
  });
};

// Emit to a specific user (all their connected sockets)
const emitToUser = (userId, event, data) => {
  const userSockets = connectedUsers.get(userId.toString());
  if (!userSockets) return;

  const io = global.io;
  if (!io) return;

  userSockets.forEach(socketId => {
    io.to(socketId).emit(event, data);
  });
};

// Emit to multiple users
const emitToUsers = (userIds, event, data) => {
  userIds.forEach(userId => {
    emitToUser(userId, event, data);
  });
};

// Get online status of a user
const isUserOnline = (userId) => {
  return connectedUsers.has(userId.toString());
};

// Get all online users from a list
const getOnlineUsers = (userIds) => {
  return userIds.filter(userId => isUserOnline(userId));
};

// Get count of online users in a chat
const getChatOnlineCount = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId).populate('participants', '_id');
    if (!chat) return 0;

    return chat.participants.filter(participant => 
      isUserOnline(participant._id)
    ).length;
  } catch (error) {
    console.error('Error getting chat online count:', error);
    return 0;
  }
};

// Broadcast to all connected sockets
const broadcastToAll = (event, data) => {
  const io = global.io;
  if (!io) return;
  
  io.emit(event, data);
};

// Remove user from all socket connections (for logout)
const disconnectUser = (userId) => {
  const userSockets = connectedUsers.get(userId.toString());
  if (!userSockets) return;

  const io = global.io;
  if (!io) return;

  userSockets.forEach(socketId => {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.disconnect(true);
    }
  });

  connectedUsers.delete(userId.toString());
};

module.exports = {
  initializeSocket,
  emitToChat,
  emitToUser,
  emitToUsers,
  isUserOnline,
  getOnlineUsers,
  getChatOnlineCount,
  broadcastToAll,
  disconnectUser,
  connectedUsers,
  socketToUser
};