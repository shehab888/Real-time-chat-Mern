const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");

const Auth = require("../middlewares/Auth");


//? the endpoints of the profile
router.get('/profile/:userId',userController.getUserProfile)
router.patch('/profile',userController.updateProfile)  
//? the endpoints of the friends
router.post('/friends',userController.addFriends)
router.get('/friends',userController.getFriends)
router.patch('/friends/:friendId',userController.updateFriends)  
router.delete('/friends/:friendId',userController.removeFriend)  

module.exports=router;