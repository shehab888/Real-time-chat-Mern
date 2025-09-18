import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import "./App.css";
import Register from "./pages/Login/Register";
import VerifyEmail from "./pages/verifyEmail/verifyEmail";
import VerifyEmailToken from "./pages/verifyEmail/verifyEmailToken";
import Profile from "./pages/ProfileUpdate/ProfileUpdate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify-email/:token" element={<VerifyEmailToken />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
