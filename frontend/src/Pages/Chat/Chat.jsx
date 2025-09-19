import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sideBar";
import ChatArea from "../../components/Chatarea/Chatarea";
import "./Chat.css";

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [activeType, setActiveType] = useState("chat"); // chat | friend

  const handleSelect = (item, type) => {
    setActiveChat(item);
    setActiveType(type);
  };

  return (
    <>
      <div className="chat-container">
        <Sidebar onSelect={handleSelect} />

        {activeChat ? (
          <ChatArea chat={activeChat} type={activeType} />
        ) : (
          <div className="chat-area">
            <div className="messages">
              Select a chat or friend to start messaging
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatPage;
