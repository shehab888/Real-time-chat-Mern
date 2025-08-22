const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const checkUserToken = require("../middlewares/checkUserToken");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", checkUserToken, authController.logout); //? proteced route
router.post("/forget-password", checkUserToken, authController.forgotPassword); //? proteced route
router.post("/reset-password", checkUserToken, authController.resetPassword); //? proteced route
router.post("/verify-email", checkUserToken, authController.verifyEmail); //? proteced route
router.get("/me", checkUserToken, authController.getCurrentUser); //? proteced route

module.exports = router;
