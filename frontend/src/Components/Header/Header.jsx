import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import BlockListPopup from "../BlockList/BlockListPopup";
import avatarIcon from "../../assets/avatar_icon.png";
import { logout } from "../../api/authApi";
import "./Header.css";

function Header() {
  const { user, setUser } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showBlockList, setShowBlockList] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="header">
      {/* Logo */}
      <div>
        <Link to="/" style={{ color: "white", fontSize: "18px" }}>
          <strong>SweetTalk</strong>
        </Link>
      </div>

      {/* If no user → show nav */}
      {!user ? (
        <nav>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
        </nav>
      ) : (
        <div className="user-menu">
          <div
            className="user-info"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <img
              src={user.profilePicture || avatarIcon}
              alt="avatar"
              className="user-avatar"
            />
            <span className="user-name">{user.username || "User"}</span>
          </div>

          {showMenu && (
            <div className="dropdown">
              <div
                className="dropdown-item"
                onClick={() => {
                  navigate("/profile");
                  setShowMenu(false);
                }}
              >
                👤 Profile
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  setShowBlockList(true);
                  setShowMenu(false);
                }}
              >
                🚫 Block List
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      )}

      {/* Block List Popup */}
      {showBlockList && (
        <BlockListPopup onClose={() => setShowBlockList(false)} />
      )}
    </header>
  );
}

export default Header;
