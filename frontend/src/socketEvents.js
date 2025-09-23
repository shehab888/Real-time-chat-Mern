const SOCKET_EVENTS = {
  // Connection events  
  AUTHENTICATE: "authenticate",
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",

  // Message events
  MESSAGE_CREATE: "message_create",
  MESSAGE_CREATED: "message_created",
  MESSAGE_EDIT: "message_edit",
  MESSAGE_EDITED: "message_edited",
  MESSAGE_DELETE: "message_delete",
  MESSAGE_DELETED: "message_deleted",
  MESSAGE_READ: "message_read",
  MESSAGES_READ: "messages_read",

  // Chat events
  CHAT_CREATE: "chat_create",
  CHAT_CREATED: "chat_created",
  CHAT_UPDATE: "chat_update",
  CHAT_UPDATED: "chat_updated",
  CHAT_DELETE: "chat_delete",
  CHAT_DELETED: "chat_deleted",
  CHAT_PINNED_MESSAGE: "chat_pinned_message",
  CHAT_UNPINNED_MESSAGE: "chat_unpinned_message",

  // Typing events
  USER_IS_TYPING: "user_typing",
  USER_HAS_TYPED: "user_has_typed",
  USER_STOP_TYPING: "user_stop_typing",
  USER_STOPPED_TYPING: "user_stopped_typing",

  // Group chat events
  GROUP_CREATED: "group_created",
  GROUP_UPDATED: "group_updated",
  USER_ADDED_TO_GROUP: "user_added_to_group",
  USER_REMOVED_FROM_GROUP: "user_removed_from_group",
  USER_PROMOTED_TO_ADMIN: "user_promoted_to_admin",
  USER_DEMOTED_FROM_ADMIN: "user_demoted_from_admin",

  // User events with the group
  USER_JOIN_CHAT: "user_join_chat",
  USER_JOINED_CHAT: "user_joined_chat",
  USER_LEAVE_CHAT: "user_leave_chat",
  USER_LEFT_CHAT: "user_left_chat",

  // Error events
  ERROR: "error",
  UNAUTHORIZED: "unauthorized",

  // File upload events
  FILE_UPLOAD_PROGRESS: "file_upload_progress",
  FILE_UPLOAD_COMPLETE: "file_upload_complete",
  FILE_UPLOAD_ERROR: "file_upload_error",
};

export default SOCKET_EVENTS;
