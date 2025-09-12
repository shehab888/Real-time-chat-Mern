const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const httpStatus = require("../utils/httpStatus");
const sendEmail = require("../utils/sendEmail");

//? GET /api/user/profile/:userId
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "username email profilePicture bio isOnline lastSeen"
    );
    if (!user) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no user profile founded by this id ",
      });
    }
    return res.status(200).json({ status: httpStatus.SUCCESS, data: user });
  } catch (error) {
    res.status(400).json({ status: httpStatus.ERROR, message: error.message });
  }
};

//? PATCH /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const reqBody = req.body; //! we can change email but don't to forget to check is verified or not (in future we can implement)
    console.log(reqBody);

    //? update the request to make the user limit to change the allowed field only (username,password,bio,profilePicture)
    const filteredRequestBody = Object.fromEntries(
      Object.entries(reqBody).filter(
        ([key]) =>
          key == "username" ||
          key == "bio" ||
          key == "password" ||
          key == "profilePicture"
      )
    );
    console.log("filteredRequestBody", { ...filteredRequestBody });

    //? make the password bcrytpted

    if (filteredRequestBody.password) {
      //? check the validation of the password
      if (filteredRequestBody.password.length < 8) {
        return res.status(400).json({
          status: httpStatus.FAIL,
          message: "the password is invalid",
        });
      }
      filteredRequestBody.password = await bcrypt.hash(
        filteredRequestBody.password,
        10
      );
    }
    // console.log('*******************************');

    await User.updateOne({ _id: user._id }, { ...filteredRequestBody });
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "the user updated their info successfuly",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/user/search?=        (I WANT TO IMPLEMENT SEARCH FOR MESSAEGS AND CHAT AND ANOTHER FOR THE USER)
const searchuser = async (req, res) => {
  try {
    const { username, email } = req.query;
    // console.log('{username,email}',{username,email});

    const resultOfSearch = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("_id username email bio profilePicture");

    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: resultOfSearch,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/user/friends
const addFriends = async (req, res) => {
  try {
    const currentUser = req.user;
    const { email, friendName } = req.body;
    const friend = await User.findOne({ email: email });
    if (!friend) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no user found by this email",
      });
    }
    if (friend.email == currentUser.email) {
      return res.status(404).status({
        status: httpStatus.FAIL,
        message: "you can not add yourself as a freind",
      });
    }

    const isFriendBefor = await User.find({
      _id: currentUser._id,
      "friends.friend": friend._id,
    });
    if (isFriendBefor) {
      return res
        .status(400)
        .json({
          status: httpStatus.FAIL,
          message: "you added this friend before",
        });
    }
    await User.updateOne(
      { _id: currentUser._id },
      { $addToSet: { friends: { friend: friend._id, friendName } } }
    );
    return res.status(201).json({
      status: httpStatus.SUCCESS,
      message: "you added your friend successfuly",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? GET /api/user/friends
const getFriends = async (req, res) => {
  try {
    const currentUser = req.user;
    const friends = await User.findOne({ _id: currentUser._id })
      .select("friends")
      .populate({ path: "friends.friend", select: "username email bio" });
    return res.status(200).json({ status: httpStatus.SUCCESS, data: friends });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? PATCH /api/user/friends/:friendId
const updateFriends = async (req, res) => {
  try {
    const currentUser = req.user;
    const { friendId } = req.params;
    const { customName } = req.body;
    const friend = await User.findOne({ _id: friendId });
    if (!friend) {
      return res
        .status(404)
        .json({ status: httpStatus.FAIL, message: "no user found by this id" });
    }
    await User.updateOne(
      { _id: currentUser._id, "friends.user": friendId },
      { $set: { "friends.$.customName": customName } }
    );

    return res.status(201).json({
      status: httpStatus.SUCCESS,
      message: "you updated your friend's data successfuly",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? DELETE /api/user/friend/:friendId
//! the blocked freind (do we remove it from the freinds ?)
const removeFriend = async (req, res) => {
  try {
    const currentUser = req.user;
    const { friendId } = req.params;
    console.log("friendId", friendId);

    const friend = await User.findById(friendId);
    console.log("friend", friend);
    if (!friend) {
      return res
        .status(404)
        .json({ status: httpStatus.FAIL, message: "no user found by this id" });
    }

    await User.updateOne(
      { _id: currentUser._id },
      { $pull: { friends: { friendId: friend._id } } }
    );

    return res.status(201).json({
      status: httpStatus.SUCCESS,
      message: "you removed your friend's data successfuly",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/user/block/:userId
const blockUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;
    const blockedUser = await User.findById(userId).select(
      "username email bio profilePicture"
    );
    if (!blockedUser) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no user found by this id to block",
      });
    }
    if (blockedUser._id == currentUser._id) {
      return res.status(400).json({
        status: httpStatus.FAIL,
        message: "you can not block yourself",
      });
    }
    await User.updateOne(
      { _id: currentUser._id },
      { $addToSet: { blockedUsers: blockedUser._id } }
    );
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "you blocked the user successfuly",
      data: blockedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/user/unblock/:userId
const unblockUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;
    const blockedUser = await User.findById(userId).select(
      "username email bio profilePicture"
    );
    if (!blockedUser) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no user found by this id to block",
      });
    }
    if (blockedUser._id == currentUser._id) {
      return res.status(400).json({
        status: httpStatus.FAIL,
        message: "you can not block yourself",
      });
    }
    await User.updateOne(
      { _id: currentUser._id },
      { $pull: { blockedUsers: blockedUser._id } }
    );
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "you unblocked the user successfuly",
      data: blockedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? GET /api/user/blocked
const getBlockedUsers = async (req, res) => {
  try {
    const currentUser = req.user;
    //? i will populate on the users and select the main info
    const blockedUsers = await User.findById(currentUser._id)
      .populate("blockedUsers", "username email bio profilePicture")
      .select("_id username email bio profilePicture");
    return res
      .status(200)
      .json({ status: httpStatus.SUCCESS, data: blockedUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? PATCH /api/user/online-status
const updateOnlineStatus = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//! methods can be applied in the future

//? POST /api/user/friend-request/:userId
// const sendFriendRequest = async (req, res) => {
//   try {

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//? POST /api/user/friend-request/:requestId/accept
// const acceptFriendRequest = async (req, res) => {
//   try {

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//? POST /api/user/friend-request/:requestId/decline
// const declineFriendRequest = async (req, res) => {
//   try {

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
module.exports = {
  getUserProfile, //done
  updateProfile, //done
  addFriends, //done
  getFriends, //done
  removeFriend, //done
  updateFriends, //done
  searchuser,
  blockUser, //done
  unblockUser, //done
  getBlockedUsers, //done
  updateOnlineStatus, // pending
};
