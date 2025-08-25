const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const Auth = require("../middlewares/Auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", Auth, authController.logout); //? Authroized route
router.post("/forget-password", authController.forgotPassword);
router.post("/reset-password/:reset_password_token", authController.resetPassword);
router.post("/verify-email/:email_verify_token", authController.verifyEmail);
router.post("/resend-email-verification/:email",authController.resendEmailVerification);
router.post("/refresh-token", Auth,authController.refreshToken); //? Authroized route
router.get("/me", Auth, authController.getCurrentUser); //? Authroized route

module.exports = router;
