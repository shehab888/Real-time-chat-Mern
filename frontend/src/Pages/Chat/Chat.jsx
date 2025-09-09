import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BlockListPopup from "../../Components/BlockList/BlockListPopup";
import FriendsListPopup from "../../Components/FriendList/FriendListPopup";
import "./Chat.css";
import profilealison from "../../assets/profile_alison.png";
import block from "../../assets/block.png";
import info from "../../assets/help_icon.png";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBlockList, setShowBlockList] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  // 🆕 للبحث
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // 🟢 إرسال رسالة
  const sendMessage = async () => {
    if (input.trim() === "" || !activeFriend) return;

    const newMsg = { text: input, sender: "me" };
    setMessages([...messages, newMsg]);
    setInput("");

    try {
      await fetch(`http://localhost:5000/api/messages/${activeFriend._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  // 🆕 البحث عن يوزر
  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/search?username=${searchInput}`,
        {
          method: "GET",
          credentials: "include", // الكوكي هيتبعت أوتوماتيك
        }
      );
      const data = await res.json();

      // console.log("Search API result:", data.data);

      if (res.ok && data) {
        // ✅ هتتعامل صح لو Array أو Object
        console.log(data.data);
        setSearchResults(Array.isArray(data.data) ? data.data : [data.data]);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Error searching user", err);
    }
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
            <input
              type="text"
              placeholder="Search by username..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={handleSearch}>🔍</button>
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
          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="sidebar-item"
                  // onClick={() => openChat(user)}
                >
                  <img
                    src={user.profilePicture || "https://i.pravatar.cc/30"}
                    alt="avatar"
                    className="profile-img"
                  />
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          )}

          {friends.map((friend) => (
            <div
              key={friend._id}
              className="sidebar-item"
              // onClick={() => openChat(friend)}
            >
              🟢 {friend.username}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {activeFriend ? (
          <>
            {/* Header */}
            <div className="chat-header">
              <img src={profilealison} alt="" className="profilephoto" />
              <p className="profilename">{activeFriend.username}</p>
              <img src={block} alt="" className="blockicon" />
              <img src={info} alt="" className="infoicon" />
            </div>

            {/* Messages */}
            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
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
          </>
        ) : (
          <div className="chat-placeholder">اختر صديق لبدء المحادثة</div>
        )}
      </div>

      {/* ✅ Block List Popup */}
      {showBlockList && (
        <BlockListPopup
          blockedUsers={blockedUsers}
          onUnblock={(user) =>
            setBlockedUsers(blockedUsers.filter((u) => u._id !== user._id))
          }
          onClose={() => setShowBlockList(false)}
        />
      )}

      {/* ✅ Friends List Popup */}
      {showFriendsList && (
        <FriendsListPopup
          friends={friends}
          onRemove={(friend) =>
            setFriends(friends.filter((f) => f._id !== friend._id))
          }
          onClose={() => setShowFriendsList(false)}
        />
      )}
    </div>
  );
};

export default Chat;
