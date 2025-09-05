const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const httpStatus = require("../utils/httpStatus");
const { emitToChat, emitToUser } = require("../utils/socketsLogic");
const SOCKET_EVENTS = require("../utils/socketEvents");

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

    //? check if the group chat is true
    if (reqBody.isGroupChat) {
      reqBody.groupOwner = currentUser._id; //? make the owner the current if the client tried to change it we update it before saving

      //? loop on the (groupd admin if there exist admin) if they are not in the particpants put them in the participants
      if (reqBody.groupAdmins) {
        for (let i = 0; i < reqBody.groupAdmins.length; i++) {
          if (reqBody.participants.includes(groupAdmins[i])) {
            reqBody.participants.pull(groupAdmins[i]);
          }
        }
      } //? delete the owner from the participants if the group owner
      if (reqBody.participants.includes(currentUser._id.toString())) {
        reqBody.participants.pull(currentUser._id);
      }
    } else {
      //? in case the clinet make the group chat is true (when update or added group owner or admins) we update it before saving
      reqBody.isGroupChat = false;
      delete reqBody.groupOwner;
      delete reqBody.groupAdmins;
      delete reqBody.chatSettings.allowOnlyAdminsToSend;

      //? add the current user as a regular participants not group owner
      if (!reqBody.participants.includes(currentUser._id.toString())) {
        reqBody.participants.push(currentUser._id);
      }
      if (reqBody.participants.length > 2) {
        return res.status(400).json({
          status: httpStatus.FAIL,
          message:
            "in the regular chat you can not add above 2 users including the current user",
        });
      }
    }

    const newChat = new Chat({
      ...reqBody,
    });
    await newChat.save();

    //? update all the users in one bulk o(1)
    await User.updateMany(
      { _id: { $in: reqBody.participants } },
      { $addToSet: { chats: newChat._id } }
    );
    emitToChat(newChat.id, SOCKET_EVENTS.CHAT_CREATED); //? emit the chat created

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
    if (chat.isGroupChat) {
      if (
        currentUser._id.toString() !== chat.groupOwner.toString() &&
        !chat.groupAdmins.some((id) => id.toString() === currentUser._id)
      ) {
        return res.status(403).json({
          status: httpStatus.FORBIDEN,
          message: "only owners and admins can modify the chat conf",
        });
      }
    }

    //? check if the group chat is true
    if (chat.isGroupChat) {
      reqBody.groupOwner = currentUser._id; //? make the owner the current if the client tried to change it we update it before saving
    } else {
      //? in case the clinet make the group chat is true (when update or added group owner or admins) we update it before saving
      reqBody.isGroupChat = false;
      delete reqBody.groupOwner;
      delete reqBody.groupAdmins;
    }

    //? update the chat
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId },
      { ...reqBody },
      { new: true }
    );

    emitToChat(chat._id, SOCKET_EVENTS.CHAT_UPDATED);

    return res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "the chat updated successfuly",
      data: updatedChat,
    });
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

    //? check if the user owner  to delete the chat if its group chat
    if (chat.isGroupChat) {
      if (currentUser._id.toString() !== chat.groupOwner.toString()) {
        return res.status(403).json({
          status: httpStatus.FORBIDEN,
          message: "only owners can delete the chat",
        });
      }
    }

    //?delete the chat from the user chat => ref.      in o(1) one bulk
    await User.updateMany(
      { _id: { $in: chat.participants } },
      { $pull: { chats: chat._id } }
    );

    //? delete the chat
    await Chat.deleteOne({ _id: chatId });

    emitToChat(chat._id, SOCKET_EVENTS.CHAT_DELETED);

    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: null,
      message: "the chat deleted successfuly",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/chat/:chatId/join
const joinGroupChat = async (req, res) => {
  try {
    const currentUser = req.user;
    const { chatId } = req.params;

    //? check the chat first => (more condtions and time complexity but less error recon)
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no chat by this id to join",
      });
    }

    //? check the chat status first (group or private)
    if (!chat.isGroupChat) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "you can join only in the group chat",
      });
    }

    //? update the chat itself
    await Chat.updateOne(
      { _id: chatId },
      { $addToSet: { participants: currentUser._id } }
    );
    //? update the user chats ref
    await User.updateOne(
      { _id: currentUser._id },
      { $addToSet: { chats: chatId } }
    );

    emitToChat(chat._id, SOCKET_EVENTS.USER_JOINED_CHAT);

    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: null,
      message: "you joined the chat sucessfuly",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//! what if the leaved user was the owner ?????????????????????????????????????????????
//? POST /api/chat/:chatId/leave
const leaveGroupChat = async (req, res) => {
  try {
    const currentUser = req.user;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no chat by this id to join",
      });
    }

    //? check the chat status first (group or private)
    if (!chat.isGroupChat) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "you can leave only in the group chat",
      });
    }

    //? update the chat itself
    await Chat.updateOne(
      { _id: chatId },
      { $pull: { participants: currentUser._id } }
    );
    //? update the user chats ref
    await User.updateOne(
      { _id: currentUser._id },
      { $pull: { chats: chatId } }
    );

    emitToChat(chat._id, SOCKET_EVENTS.USER_LEFT_CHAT);

    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: null,
      message: "you leaved the chat sucessfuly",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/chat/:chatId/add-member/:userId
const addMemberToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no chat found by this id ",
      });
    }

    if (!chat.isGroupChat) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "you can add members only in group chat",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no user found by this id ",
      });
    }

    const ifTheUserFound = chat.participants.includes(userId);
    if (ifTheUserFound) {
      return res.status(400).json({
        status: httpStatus.FAIL,
        message: "the user is already found in this chat",
      });
    }

    //? update the chat participants
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { participants: user._id } },
      { new: true }
    )
      .select("chatname isGroupChat groupOwner groupAdmins participants")
      .populate("participants", "username email bio profilePicture"); //? i used another query to implement the method add to set internally in the db

    //? update the user chats
    await User.updateOne(
      { _id: userId },
      { $addToSet: { chats: updatedChat._id } }
    ); //? i used another query to implement the method add to set internally in the db

    //? handle the sockets
    emitToChat(chatId, SOCKET_EVENTS.USER_ADDED_TO_GROUP);

    return res
      .status(200)
      .json({ status: httpStatus.SUCCESS, data: updatedChat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/chat/:chatId/remove-member/:userId
const removeMemberFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.params;
    const currentUser = req.user;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no chat found by this id ",
      });
    }
    //? check the chat if its group chat
    if (!chat.isGroupChat) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "you can remove users only in group chat",
      });
    }

    //? get the user will be added
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no user found by this id ",
      });
    }
    //? check if the user will be added in the chat
    const isTheUserFoundInChat = chat.participants.includes(userId);
    if (!isTheUserFoundInChat) {
      return res.status(403).json({
        status: httpStatus.FAIL,
        message: "the user is not found in this chat",
      });
    }

    //? check if the admin in the group
    const isTheAdminInSameGroup = chat.participants.includes(currentUser._id);
    if (!isTheAdminInSameGroup) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "this admin is not in the group",
      });
    }

    //? check if the current usre is admin to delete the users
    const isUserGruopAdmin =
      currentUser._id.toString() == chat.groupOwner.toString();

    if (!isUserGruopAdmin) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "only admins can delete users",
      });
    }

    //? update the chat participants
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { participants: userId }, $pull: { groupAdmins: userId } },
      { new: true }
    )
      .select("chatname isGroupChat groupOwner groupAdmins participants")
      .populate("participants", "username email bio profilePicture"); //? i used another query to implement the method add to set internally in the db
    //? update the user chats
    await User.updateOne({ _id: userId }, { $pull: { chats: chatId } }); //? i used another query to implement the method add to set internally in the db

    emitToChat(chatId, SOCKET_EVENTS.USER_DEMOTED_FROM_ADMIN);

    return res
      .status(200)
      .json({ status: httpStatus.SUCCESS, data: updatedChat });
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

//? POST /api/chat/:chatId/pin-message/:messageId
//! related with the messages
const pinMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    //? get the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res
        .status(404)
        .json({ status: httpStatus.FAIL, message: "no chat found by this id" });
    }
    //? get the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res
        .status(404)
        .json({ status: httpStatus.FAIL, message: "no chat found by this id" });
    }

    //? check if the message in this chat
    let messageIsFoundInChat = message.chat.toString() == chat._id.toString();
    if (!messageIsFoundInChat) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "this message not included in this chat",
      });
    }

    //? update the chat to put the latese message
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chat._id },
      { $addToSet: { pinnedMessages: message._id } },
      { new: true }
    );

    //? another way to update
    // chat.latestMessage.push(message._id)
    // await chat.save();
    emitToChat(updatedChat._id, SOCKET_EVENTS.CHAT_PINNED_MESSAGE);

    return res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "the message added in the pinned Message of the chat",
      data: updatedChat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? post /api/chat/:chatId/unpin-message/:messageId
//! related with the messages
const unpinMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    //? get the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res
        .status(404)
        .json({ status: httpStatus.FAIL, message: "no chat found by this id" });
    }
    //? get the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res
        .status(404)
        .json({ status: httpStatus.FAIL, message: "no chat found by this id" });
    }

    //? check if the message in this chat
    let messageIsFoundInChat = message.chat.toString() == chat._id.toString();
    if (!messageIsFoundInChat) {
      return res.status(403).json({
        status: httpStatus.FORBIDEN,
        message: "this message not included in this chat",
      });
    }

    //? update the chat to put the latese message
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chat._id },
      { $pull: { pinnedMessages: message._id } },
      { new: true }
    );

    //? another way to update
    // chat.latestMessage.push(message._id)
    // await chat.save();
    emitToChat(updatedChat._id, SOCKET_EVENTS.CHAT_UNPINNED_MESSAGE);

    return res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "the message unpinned from the chat",
      data: updatedChat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllchat, //done
  createChat, //done
  getChatById, //done
  updateChat, //done (owner,admin)
  deleteChat, //done (owner)

  joinGroupChat, //done
  leaveGroupChat, //done

  addMemberToGroup, // done
  removeMemberFromGroup, // for owner only (done)
  manageGroupAdmin,

  pinMessage, //done
  unpinMessage, //done
};
