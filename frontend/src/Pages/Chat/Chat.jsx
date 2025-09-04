import React, { useState } from "react";
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

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { id: Date.now(), text: input, sender: "me" }]);
    setInput("");
  };



  return (
    
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
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
              className={`message ${msg.sender === "me" ? "me" :  "other"}`}
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
              accept="image/*,video/*,.pdf,.doc,.docx" />
          </label>
          <button onClick={sendMessage}>➤</button>
        </div>

      </div>
    </div>
  );
};

export default Chat;
