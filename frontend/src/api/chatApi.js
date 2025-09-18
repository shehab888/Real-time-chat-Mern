// src/api/chatApi.js
import api from "./axiosConfig";

// Create new chat
export const createChat = (chatData) =>
  api.post("/chat", chatData, {
    headers: { "Content-Type": "application/json" },
  });

// Get chat by ID
export const getChatById = (chatId) =>
  api.get(`/chat/${chatId}`);

// Get all chats
export const getAllChats = () =>
  api.get("/chat");

// Delete chat
export const deleteChat = (chatId) =>
  api.delete(`/chat/${chatId}`);

// Update chat config (مثلاً: الاسم، الوصف..الخ)
export const updateChatConfig = (chatId, updatedData) =>
  api.put(`/chat/${chatId}`, updatedData, {
    headers: { "Content-Type": "application/json" },
  });

// Add member to chat
export const addMember = (chatId, userId) =>
  api.post(`/chat/${chatId}/add-member/${userId}`);

// Remove member from chat
export const removeMember = (chatId, userId) =>
  api.delete(`/chat/${chatId}/remove-member/${userId}`);

// Pin message
export const pinMessage = (chatId, messageId) =>
  api.post(`/chat/${chatId}/pin-message/${messageId}`);

// Unpin message
export const unpinMessage = (chatId, messageId) =>
  api.delete(`/chat/${chatId}/pin-message/${messageId}`);

// Join chat
export const joinChat = (chatId) =>
  api.post(`/chat/${chatId}/join`);

// Leave chat
export const leaveChat = (chatId) =>
  api.post(`/chat/${chatId}/leave`);
