import React, { useState, useEffect } from "react";
import { getChatMessages, createMessage } from "../../api/messageApi";
import avatarIcon from "../../assets/avatar_icon.png";

const ChatArea = ({ chat, type }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!chat) return;

    const fetchMessages = async () => {
      try {
        const res = await getChatMessages(chat._id);
        setMessages(res.data || []);
      } catch (err) {
        console.error("fetchMessages error:", err);
      }
    };

    fetchMessages();
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // تحديث الواجهة فورًا
    setMessages([...messages, { text: input, sender: "me" }]);
    setInput("");

    try {
      await createMessage(chat._id, { text: input });
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  };

  return (
    <div className="chat-area">
      {/* Header */}
      <div className="chat-header">
        <img
          src={chat.profilePicture || avatarIcon}
          alt="avatar"
          className="chat-avatar"
        />
        <p className="chat-name">{chat.name || chat.friendName || chat.username}</p>
      </div>

      {/* Messages */}
      <div className="messages scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
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
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
};

export default ChatArea;
