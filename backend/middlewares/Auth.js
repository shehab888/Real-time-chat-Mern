const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const httpStatus = require("../utils/httpStatus");
const Auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token;
    console.log("token in middleware:", token,'req.cookies',req.cookies);

    if (!token) {
      return res
        .status(401)
        .json({
          status: httpStatus.FAIL,
          message: "UN AUTHORIZED - no token provided",
        });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res
        .status(401)
        .json({ status: httpStatus.FAIL, message: " token not valid" });
    }

    const user = await User.findById(decode._id);
    if (!user) {
      return res
        .status(400)
        .json({
          status: httpStatus.FAIL,
          message: "UN AUTHORIZED - no user founded by this token",
        });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ status: httpStatus.ERROR, message: error.message });
  }
};
module.exports = Auth;
