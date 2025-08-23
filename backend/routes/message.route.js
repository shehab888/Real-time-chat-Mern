const express = require("express");

const router = express.Router();

const messageController = require("../controllers/message.controller");

const Auth = require("../middlewares/Auth");


module.exports=router;