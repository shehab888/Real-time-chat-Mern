// src/api/messageApi.js
import api from "./axiosConfig";

// Get messages for a specific chat
export const getChatMessages = (chatId) =>
  api.get(`/messages/${chatId}`);

// Create/send new message in a chat
export const createMessage = (chatId, messageData) =>
  api.post(
    `/messages/${chatId}`,
    messageData,
    { headers: { "Content-Type": "application/json" } }
  );

// Update message
export const updateMessage = (messageId, updatedData) =>
  api.put(
    `/messages/${messageId}`,
    updatedData,
    { headers: { "Content-Type": "application/json" } }
  );

// Delete message
export const deleteMessage = (messageId) =>
  api.delete(`/messages/${messageId}`);

// Mark message as read
export const readMessage = (messageId) =>
  api.post(`/message/${messageId}/read`);

// Get unread messages count
export const getUnreadCount = () =>
  api.get("/message/unread-count");
