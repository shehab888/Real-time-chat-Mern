import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BlockListPopup from "../../Components/BlockList/BlockListPopup";
import FriendsListPopup from "../../Components/FriendList/FriendListPopup";
import "./Chat.css"; // نستورد ملف الستايل
import profilealison from "../../assets/profile_alison.png";
import block from "../../assets/block.png";
import info from "../../assets/help_icon.png";
const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! كيفك؟", sender: "me" },
    { id: 2, text: "الحمد لله وانت؟", sender: "other" },
    { id: 3, text: "تمام 😍", sender: "me" },
  ]);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBlockList, setShowBlockList] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false); // ✅ جديد
  const [blockedUsers, setBlockedUsers] = useState([
    "User 1",
    "User 2",
    "User 3",
  ]);
  const [friends, setFriends] = useState(["Friend A", "Friend B", "Friend C"]); // ✅ جديد
  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { id: Date.now(), text: input, sender: "me" }]);
    setInput("");
  };

  const handleUnblock = (user) => {
    setBlockedUsers(blockedUsers.filter((u) => u !== user));
  };

  // ✅ مسح من الفريند ليست
  const handleRemoveFriend = (friend) => {
    setFriends(friends.filter((f) => f !== friend));
  };
  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-section">
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="profile-img"
          />

          {/* Search in the middle */}
          <div className="search-box">
            <input type="text" placeholder="Search..." />
          </div>

          {/* Settings button */}
          <button
            className="settings-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ⚙️
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="dropdown">
              <Link to={"/Profile"} className="dropdown-item">
                My Profile
              </Link>
              <div
                className="dropdown-item"
                onClick={() => {
                  setShowBlockList(true);
                  setMenuOpen(false);
                }}
              >
                Block List
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  setShowFriendsList(true);
                  setMenuOpen(false);
                }}
              >
                Friends List
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-header">Chats</div>
        <div className="sidebar-list">
          <div className="sidebar-item">🟣 صديق ١</div>
          <div className="sidebar-item">🟢 صديق ٢</div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {/* Header */}
        <div className="chat-header">
          <img src={profilealison} alt="" className="profilephoto" />
          <p className="profilename">Alison</p>
          <img src={block} alt="" className="blockicon" />
          <img src={info} alt="" className="infoicon" />
        </div>

        {/* Messages */}
        <div className="messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === "me" ? "me" : "other"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <label className="b1">
            📎
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
          </label>
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
      {/* ✅ Block List Popup */}
      {showBlockList && (
        <BlockListPopup
          blockedUsers={blockedUsers}
          onUnblock={handleUnblock}
          onClose={() => setShowBlockList(false)}
        />
      )}

      {/* ✅ Friends List Popup */}
      {showFriendsList && (
        <FriendsListPopup
          friends={friends}
          onRemove={handleRemoveFriend}
          onClose={() => setShowFriendsList(false)}
        />
      )}
    </div>
  );
};

export default Chat;
