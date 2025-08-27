const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");

const Auth = require("../middlewares/Auth");


//? the endpoints of the profile
router.get('/profile/:userId',userController.getUserProfile)
router.patch('/profile',userController.updateProfile)  
router.get('/search',userController.searchuser)
//? the endpoints of the friends
router.post('/friends',userController.addFriends)
router.get('/friends',userController.getFriends)
router.patch('/friends/:friendId',userController.updateFriends)  
router.delete('/friends/:friendId',userController.removeFriend)  
//? the endpoints of the blocking users
router.post('/block/:userId',userController.blockUser)
router.post('/unblock/:userId',userController.unblockUser)
router.get('/blocked',userController.getBlockedUsers)

module.exports=router;