import api from "./axiosConfig";

// update user profile
export const updateUserProfile = (profileData) =>
  api.patch(
    "/user/profile",
    profileData, // ده هيكون object { username, bio, profilePicture, ... }
    { headers: { "Content-Type": "application/json" } }
  );

// friends-related API calls
export const addFriend = (email, friendName) =>
  api.post(
    "/user/friends",
    { email, friendName },
    { headers: { "Content-Type": "application/json" } }
  );

export const deleteFriend = (friendId) =>
  api.delete(`/user/friends/${friendId}`);

export const getFriends = () => api.get(`/user/friends`);

// user search
export const searchForUsers = (username) =>
  api.get("/user/search", {
    params: { username },
  });
  
// block/unblock users
export const blockUser = (targetId) =>
  api.post(`/user/block/${targetId}`);

export const unblockUser = (targetId) =>
  api.post(`/user/unblock/${targetId}`);

export const getBlockedUsers = () => api.get(`/user/blocked`);
