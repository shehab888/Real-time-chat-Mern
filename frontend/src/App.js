import "./App.css";
import ProfileUpdate from "./Pages/ProfileUpdate/ProfileUpdate";
import Chat from "./Pages/Chat/Chat";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
