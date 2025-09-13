const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const httpStatus = require("../utils/httpStatus");
const sendEmail = require("../utils/sendEmail");

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const reqBody = req.body;

    if (!reqBody.password || reqBody.password.length < 8) {
      return res
        .status(400)
        .json({ status: httpStatus.FAIL, message: "not valid password" });
    }

    const hashedPassword = await bcrypt.hash(reqBody.password, 10);
    // console.log('hashedpassword',hashedPassword);

    const newUser = new User({
      ...reqBody,
      isVerified: false, //? make it false if the user tried to make it true it will be updated and the db will take the last
      password: hashedPassword,
    });

    //? create the token for verifying the email and send it to the cookies
    const email_verify_token = jwt.sign(
      { _id: newUser._id },
      process.env.EMAIL_SECRET_KEY,
      { expiresIn: "30m" }
    );
    res.cookie("email_verify_token", email_verify_token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    const url = `${process.env.CLIENT_URL}/api/auth/verify-email/${email_verify_token}`;
    // req.userEmail=newUser.email
    //? save the user in the db before the sent of the email to check if something of the data repeated like email or not
    await newUser.save();

    await sendEmail(
      newUser.email,
      "verify the email",
      `<p>click <a href=${url}>here</a> to verify your email</p>`
    );

    return res.status(201).json({ status: httpStatus.SUCCESS, data: newUser });
  } catch (error) {
    res.status(500).json({ status: httpStatus.ERROR, message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log({email,password});

    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ status: httpStatus.FAIL, message: "not valid password" });
    }
    // console.log('************');

    const user = await User.findOne({ email: email }).select({
      privacy: false,
    });
    console.log(user);

    if (!user) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "email or password is not correct",
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "email or password is not correct",
      });
    }
    //? check the user verification
    //! not enabled for testing
    // if (!user.isVerified) {
    //   return res.status(403).json({
    //     status: httpStatus.FORBIDEN,
    //     message: "the user did not verified their email",
    //   });
    // }
    const jwt_token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10m",
    });
    console.log("jwt_token", jwt_token);

    res.cookie("jwt_token", jwt_token, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    return res.status(200).json({ status: httpStatus.SUCCESS, data: user });
  } catch (error) {
    res.status(500).json({ status: httpStatus.ERROR, message: error.message });
  }
};

//? POST /api/auth/logout
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt_token");
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "you logged out successfuly",
    });
  } catch (error) {
    res.status(500).json({ status: httpStatus.ERROR, message: error.message });
  }
};

//? POST /api/auth/verify-email/:token
const verifyEmail = async (req, res) => {
  try {
    const { email_verify_token } = req.params;
    // console.log("req.params", req.params);
    console.log("email_verify_token", email_verify_token);

    const decode = jwt.verify(email_verify_token, process.env.EMAIL_SECRET_KEY);
    if (!decode) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "the token of verification the email not valid",
      });
    }
    console.log("decode", decode);

    await User.updateOne({ _id: decode._id }, { isVerified: true });
    // req.user.isVerified=true;
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "the email has been verified successfuly",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const resendEmailVerification = async (req, res) => {
  try {
    //? create the token for verifying the email and send it to the cookies
    const { email } = req.params;
    let nonVerifiedUser = await User.findOne({ email });

    if (!nonVerifiedUser) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no user found by this email",
      });
    }

    const email_verify_token = jwt.sign(
      { _id: nonVerifiedUser._id },
      process.env.EMAIL_SECRET_KEY,
      { expiresIn: "15m" }
    );
    res.cookie("email_verify_token", email_verify_token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    const url = `${process.env.CLIENT_URL}/api/auth/verify-email/${email_verify_token}`;
    await sendEmail(
      email,
      "verify the email",
      `<p>click <a href=${url}>here</a> to verify your email</p>`
    );

    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "the email has been resended successfuly",
    });
  } catch (error) {}
};
//? GET /api/auth/me
const getCurrentUser = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res
        .status(404)
        .json({ status: httpStatus.FAIL, message: "user not found" });
    }
    return res
      .status(200)
      .json({ status: httpStatus.SUCCESS, data: currentUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//? POST /api/auth/refresh-token
const refreshToken = async (req, res) => {
  try {
    const user = req.user; //? get the user from the middleware of the auth after verifying
    const jwt_token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10m",
    });
    res.cookie("jwt_token", jwt_token, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "the jwt token has been refrshed",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no user found by this email",
      });
    }
    console.log("user", user);

    const reset_verify_email = jwt.sign(
      { _id: user._id },
      process.env.FORGET_SECRET_KEY,
      { expiresIn: "15m" }
    );
    res.cookie("reset_verify_email", reset_verify_email, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    const url = `${process.env.CLIENT_URL}/api/auth/reset-password/${reset_verify_email}`;
    await sendEmail(
      email,
      "reset your password",
      `<p>click <a href=${url}>here</a> to reset your password</p>`
    );
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "the email of reset password has been sent successfuly",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  //! use the bcrypt !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  try {
    const { reset_password_token } = req.params;
    const { password } = req.body;
    const decode = jwt.verify(
      reset_password_token,
      process.env.FORGET_SECRET_KEY
    );
    if (!decode) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "the token of reset the password not valid",
      });
    }
    const user = await User.findOne({ _id: decode._id }).select(
      "username email"
    );
    if (!user) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        message: "no found user by this jwt token",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: user._id }, { password: hashedPassword });

    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: user,
      message: "user password updated successfuly",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendEmailVerification,
};
