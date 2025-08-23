const User = require('../models/user.model');

//? GET /api/users/profile/:userId
const getUserProfile = async (req, res) => {
  try {
  
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
   
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/users/search
const searchUsers = async (req, res) => {
  try {
    
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/users/friends
const getFriends = async (req, res) => {
  try {
  
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE /api/users/friend/:friendId
const removeFriend = async (req, res) => {
    try {
        
        
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/users/block/:userId
const blockUser = async (req, res) => {
  try {
    
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/users/unblock/:userId
const unblockUser = async (req, res) => {
  try {
    
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? GET /api/users/blocked
const getBlockedUsers = async (req, res) => {
  try {
    
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? PUT /api/users/online-status
const updateOnlineStatus = async (req, res) => {
  try {
      
      
} catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//! methods can be applied in the future

//? POST /api/users/friend-request/:userId
// const sendFriendRequest = async (req, res) => {
//   try {

    
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//? POST /api/users/friend-request/:requestId/accept
// const acceptFriendRequest = async (req, res) => {
//   try {

    
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//? POST /api/users/friend-request/:requestId/decline
// const declineFriendRequest = async (req, res) => {
//   try {

    
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
module.exports = {
  getUserProfile,
  updateProfile,
  searchUsers,
  getFriends,
  removeFriend,
  blockUser,
  unblockUser,
  getBlockedUsers,
  updateOnlineStatus
  //?   sendFriendRequest,
  //?   acceptFriendRequest,
  //?   declineFriendRequest,
};