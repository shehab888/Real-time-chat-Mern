const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chat.controller");

const Auth = require("../middlewares/Auth");

router.post('/',chatController.createChat);
router.get('/',chatController.getAllchat);

router.get('/:chatId',chatController.getChatById);
router.patch('/:chatId',chatController.updateChat);
router.delete('/:chatId',chatController.deleteChat);

router.post('/:chatId/join',chatController.joinGroupChat)
router.post('/:chatId/leave',chatController.leaveGroupChat)

router.post('/:chatId/add-member/:userId',chatController.addMemberToGroup)
router.post('/:chatId/remove-member/:userId',chatController.removeMemberFromGroup)

router.post('/:chatId/pin-message/:messageId',chatController.pinMessage)
router.post('/:chatId/unpin-message/:messageId',chatController.unpinMessage)

module.exports=router;