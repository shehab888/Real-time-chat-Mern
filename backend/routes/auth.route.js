const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const Auth = require("../middlewares/Auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", Auth, authController.logout); //? proteced route
router.post("/forget-password", Auth, authController.forgotPassword); //? proteced route
router.post("/reset-password", Auth, authController.resetPassword); //? proteced route
router.post("/verify-email", Auth, authController.verifyEmail); //? proteced route
router.get("/me", Auth, authController.getCurrentUser); //? proteced route

module.exports = router;
