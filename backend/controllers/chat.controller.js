const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const httpStatus = require("../utils/httpStatus");

//? GET /api/chat
const getAllchat = async (req, res) => {
  try {
    const currentUser = req.user;
    const chats = await Chat.find({ _id: { $in: currentUser.chats } });
    return res.status(200).json({ status: httpStatus.SUCCESS, data: chats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/chat/create
const createChat = async (req, res) => {
  try {
    const currentUser = req.user;
    const reqBody = req.body;

    //? push the current user to be a part of the group
    reqBody.participants.push(currentUser._id);

    const newChat = new Chat({
      ...reqBody,
      groupOwner: currentUser._id, //? because the owner is always the person who create the group even we took it in the request it still the owner is the current user
    });
    await newChat.save();

    //? update all the users in one bulk o(1)
    await User.updateMany(
      { _id: { $in: reqBody.participants } },
      { $addToSet: { chats: newChat._id } }
    );

    return res.status(201).json({
      status: httpStatus.SUCCESS,
      message: "the chat has been created",
      data: newChat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? GET /api/chat/:chatId
//! search for chat for the same user not in the global
const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const currentUser = req.user;

    //? get the chat first
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no chat found by this id ",
      });
    }

    //? check if he chat in the list of the user chat
    if (!currentUser.chats.some((id) => id.toString() === chatId)) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "you can not get this chat",
      });
    }

    return res.status(200).json({ status: httpStatus.SUCCESS, data: chat });
  } catch (error) {
    return res.status(400).json({
      status: httpStatus.ERROR,
      message: "id not valid or server error => " + error.message,
    });
  }
};

//? PATCH /api/chat/:chatId
const updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const currentUser = req.user;
    const reqBody = req.body;

    //? get the chat first
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no chat found by this id ",
      });
    }

    //? check if he chat in the list of the user chat
    if (!currentUser.chats.some((id) => id.toString() === chatId)) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "you are not in this chat",
      });
    }

    //? check if the user owner or an admin to modify the chat conf
    if (
      currentUser._id.toString() !== chat.groupOwner.toString() &&
      !chat.groupAdmins.some((id) => id.toString() === currentUser._id)
    ) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "only owners and admins can modify the chat conf",
      });
    }

    //? update the chat
    await Chat.updateOne(
      { _id: chatId },
      { ...reqBody, groupOwner: chat.groupOwner }
    );

    return res.status(200).json({ status: httpStatus.SUCCESS, data: chat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? DELETE /api/chat/:chatId
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const currentUser = req.user;
  

    //? get the chat first
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no chat found by this id ",
      });
    }

    //? check if he chat in the list of the user chat
    if (!currentUser.chats.some((id) => id.toString() === chatId)) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "you are not in this chat",
      });
    }

    //? check if the user owner  to delete the chat 
    if (currentUser._id.toString() !== chat.groupOwner.toString()) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "only owners can delete the chat",
      });
    }

    //?delete the chat from the user chat => ref.      in o(1) one bulk 
    await User.updateMany({_id:{$in:chat.participants}},{$pull:{chats:chat._id}}) 

    //? delete the chat
    await Chat.deleteOne(
      { _id: chatId },
    );



    return res.status(200).json({ status: httpStatus.SUCCESS, data: null,message:"the chat deleted successfuly" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/chat/:chatId/join
const joinGroupChat = async (req, res) => {
  try {
    // Your join group chat logic here
    // Current user available in req.user from auth middleware
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/chat/:chatId/leave
const leaveGroupChat = async (req, res) => {
  try {
    // Your leave group chat logic here
    // Current user available in req.user from auth middleware
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/chat/:chatId/add-member
const addMemberToGroup = async (req, res) => {
  try {
    // Your add member to group logic here
    // Current user available in req.user from auth middleware
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/chat/:chatId/remove-member
const removeMemberFromGroup = async (req, res) => {
  try {
    // Your remove member from group logic here
    // Current user available in req.user from auth middleware
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/chat/:chatId/admin
const manageGroupAdmin = async (req, res) => {
  try {
    // Your manage group admin logic here
    // Current user available in req.user from auth middleware
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/chat/:chatId/pin-message
//! related with the messages
const pinMessage = async (req, res) => {
  try {
    // Your pin message logic here
    // Current user available in req.user from auth middleware
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? DELETE /api/chat/:chatId/pin-message/:messageId
//! related with the messages
const unpinMessage = async (req, res) => {
  try {
    // Your unpin message logic here
    // Current user available in req.user from auth middleware
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllchat, //done
  createChat, //done
  getChatById, //done
  updateChat, //done
  deleteChat, //done

  joinGroupChat,
  leaveGroupChat,

  addMemberToGroup,
  removeMemberFromGroup, // owner and group admin only
  manageGroupAdmin,

  pinMessage,
  unpinMessage,
};
