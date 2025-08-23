const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const httpStatus = require('../utils/httpStatus')

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const {username,email,password}=req.body;
    // console.log({username,email,password});
    
    if(!password ||  password.length<8 ){
        return res.status(400).json({status:httpStatus.FAIL,message:"not valid password"})
      }

    const hashedPassword=await bcrypt.hash(password,10);
    // console.log('hashedpassword',hashedPassword);
    

    const newUser=new User({
      username,
      email,
      password:hashedPassword
    })

    await newUser.save()
    return res.status(201).json({status:httpStatus.SUCCESS,data:newUser}).select({"__v":false})

  } catch (error) {
    res.status(500).json({status:httpStatus.ERROR, message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
      const {email,password}=req.body
      // console.log({email,password});
      
      if(!password ||  password.length<8 ){
        return res.status(400).json({status:httpStatus.FAIL,message:"not valid password"})
      }
      // console.log('************');
      
      const user=await User.findOne({email:email})
      console.log(user);
      
      if(!user){
        return res.status(404).json({status:httpStatus.FAIL,message:"email or password is not correct"})
      }
      const checkPassword=await bcrypt.compare(password,user.password);
      if(!checkPassword){
        return res.status(404).json({status:httpStatus.FAIL,message:"email or password is not correct"})
      }
      // console.log('doneeeeeeeeeeeeeeeeee');
      
      const jwt_token=jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'2m'})
      console.log('jwt_token',jwt_token);
      
      res.cookie('jwt_token',jwt_token,{httpOnly: true,maxAge:2*60*1000})
      return res.status(200).json({status:httpStatus.SUCCESS,data:user})
    
  } catch (error) {
    res.status(500).json({status:httpStatus.ERROR, message: error.message });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  try {
    res.clearCookie('jwt_token')
    return res.status(200).json({status:httpStatus.SUCCESS,message:"you logged out successfuly"})
    
  } catch (error) {
    res.status(500).json({status:httpStatus.ERROR, message: error.message });
  }
};

// GET /api/auth/me
const getCurrentUser = async (req, res) => {
  try {
    
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/refresh-token
const refreshToken = async (req, res) => {
  try {
    // Your refresh token logic here
    // Get token from cookies: req.cookies.token
    // Set new token in cookie after refresh:
    // const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // res.cookie('token', newToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    // Your forgot password logic here
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    // Your reset password logic here
    // After successful password reset, set new JWT token in cookie:
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/verify-email/:token
const verifyEmail = async (req, res) => {
  try {
    // Your verify email logic here
    
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
  verifyEmail
};