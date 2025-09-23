import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatArea from "../../components/Chatarea/Chatarea";
import "./Chat.css";

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [activeType, setActiveType] = useState("chat"); // chat | friend

  const handleSelect = (item, type) => {
    console.log("Selected item:", item, "of type:", type);
    setActiveChat(item);
    setActiveType(type);
  };

  return (
    <>
      <div className="chat-container">
        <Sidebar onSelect={handleSelect} />

        {activeChat && (activeType === "chat" || activeType === "friend") ? (
          <ChatArea chat={activeChat} />
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
