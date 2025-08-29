import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
const Login = () => {
      const [currentstate,setcurrentstate]=useState("Sign Up")              
  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className="logo" />
      <form className="login-form">
      <h2>{currentstate}</h2>
      {currentstate === "Sign Up" ?<input type="text" placeholder='Username' className='username inp' required/> : ""}
      <input type="email" placeholder='Email Address' className='email inp' required/>
      <input type="password" placeholder='Password' className='password inp' required/>
      <button type="submit" className='login-button'>{currentstate === "Sign Up" ? "Create new account":"Login Now"}</button>
      
      <div className="login-terms">
         <input type="checkbox" />           
         <p> Agree to our Terms of Service and Privacy Policy.</p>
      </div>
      <div className="login-forgot">
         {currentstate === "Sign Up" ?
         <p>Already have an account <span onClick={() => setcurrentstate("Login")}>Login Here</span></p>
         :<p>Create an account <span onClick={() => setcurrentstate("Sign Up")}>Click Here</span></p>
         }     
      </div>
      </form>
    </div>
  )
}

export default Login
