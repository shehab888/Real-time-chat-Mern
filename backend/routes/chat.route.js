const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chat.controller");

const Auth = require("../middlewares/Auth");

router.post('/',chatController.createChat);
router.get('/',chatController.getAllchat);
router.get('/:chatId',chatController.getChatById);
router.patch('/:chatId',chatController.updateChat);
router.delete('/:chatId',chatController.deleteChat);

module.exports=router;