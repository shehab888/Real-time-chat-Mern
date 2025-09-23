import React, { useState, useEffect } from "react";
import { getChatMessages } from "../../api/messageApi";
import avatarIcon from "../../assets/avatar_icon.png";
import { io } from "socket.io-client";
import SOCKET_EVENTS from "../../socketEvents"; // ملف مشترك
import useAuthStore from "../../store/useAuthStore";

// ⚠️ غير الـ URL ده حسب السيرفر
const socket = io("http://localhost:5000", { withCredentials: true });

const ChatArea = ({ chat }) => {
  const { user: currentUser } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!chat) return console.log("No chat selected");
    console.log("Chat changed");
    // ✅ اتأكد من الاتصال
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    // 🟢 تحميل الرسائل القديمة
    const fetchMessages = async () => {
      try {
        const res = await getChatMessages(chat._id);
        setMessages(res.data || []);
      } catch (err) {
        console.error("fetchMessages error:", err);
      }
    };
    fetchMessages();

    // 🟢 سماع الرسائل الجديدة
    socket.on(SOCKET_EVENTS.MESSAGE_CREATED, (msg) => {
      console.log("📩 New message via socket:", msg);
      if (msg.chatId === chat._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off(SOCKET_EVENTS.MESSAGE_CREATED);
    };
  }, [chat]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const tempMsg = {
      text: input,
      sender: currentUser._id,
      chatId: chat._id,
      temp: true,
    };
    setMessages((prev) => [...prev, tempMsg]);
    setInput("");

    socket.emit(SOCKET_EVENTS.MESSAGE_CREATE, {
      chatId: chat._id,
      senderId: currentUser._id,
      text: input,
    });
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        <img
          src={chat.profilePicture || avatarIcon}
          alt="avatar"
          className="chat-avatar"
        />
        <p className="chat-name">
          {chat.name || chat.friendName || chat.username}
        </p>
      </div>

      <div className="messages scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${
              msg.sender === currentUser._id ? "me" : "other"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

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
