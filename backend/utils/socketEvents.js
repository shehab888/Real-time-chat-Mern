// utils/socketsevents.js
const SOCKET_EVENTS = {
  // Connection events
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  
  // Message events
  NEW_MESSAGE: 'new_message',
  MESSAGE_EDITED: 'message_edited',
  MESSAGE_DELETED: 'message_deleted',
  MESSAGE_READ: 'message_read',
  MESSAGES_READ: 'messages_read',
  
  // Chat events
  CHAT_CREATED: 'chat_created',
  CHAT_UPDATED: 'chat_updated',
  CHAT_DELETED: 'chat_deleted',
  USER_JOINED_CHAT: 'user_joined_chat',
  USER_LEFT_CHAT: 'user_left_chat',
  
  // Typing events
  USER_TYPING: 'user_typing',
  USER_STOPPED_TYPING: 'user_stopped_typing',
  
  // Group chat events
  GROUP_CREATED: 'group_created',
  GROUP_UPDATED: 'group_updated',
  USER_ADDED_TO_GROUP: 'user_added_to_group',
  USER_REMOVED_FROM_GROUP: 'user_removed_from_group',
  USER_PROMOTED_TO_ADMIN: 'user_promoted_to_admin',
  USER_DEMOTED_FROM_ADMIN: 'user_demoted_from_admin',
  
  // Friend events
  FRIEND_REQUEST_SENT: 'friend_request_sent',
  FRIEND_REQUEST_ACCEPTED: 'friend_request_accepted',
  FRIEND_REQUEST_DECLINED: 'friend_request_declined',
  FRIEND_REMOVED: 'friend_removed',
  
  // Error events
  ERROR: 'error',
  UNAUTHORIZED: 'unauthorized',
  
  // File upload events
  FILE_UPLOAD_PROGRESS: 'file_upload_progress',
  FILE_UPLOAD_COMPLETE: 'file_upload_complete',
  FILE_UPLOAD_ERROR: 'file_upload_error'
};

module.exports = {
  SOCKET_EVENTS
};