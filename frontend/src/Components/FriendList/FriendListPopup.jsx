import React, { useState, useEffect } from "react";
import "./FriendListPopup.css";

const FriendsListPopup = ({ onClose }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 جلب الاصدقاء من API
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/friends", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        console.log("Fetched friends:", data.data.friends);
        if (res.ok && Array.isArray(data.data.friends)) {
          setFriends(data.data.friends);
        } else {
          setFriends([]);
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  // 🟢 مسح صديق
  const handleRemoveFriend = async (friendId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this friend?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/user/friends/${friendId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        // امسح من الليستة
        setFriends((prev) => prev.filter((f) => f.user._id !== friendId));
        // بعد ما يتم المسح اقفل البوب أب
        onClose();
      } else {
        console.error("Failed to remove friend");
      }
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>👥 Friends List</h3>
          <button className="close-btn" onClick={onClose}>
            ❌
          </button>
        </div>

        <div className="popup-content">
          {loading ? (
            <p>⏳ Loading friends...</p>
          ) : friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend._id} className="friend-item">
                <span>👤 {friend.customName}</span>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFriend(friend.user._id)}
                >
                  🗑️ Remove
                </button>
              </div>
            ))
          ) : (
            <p className="empty-text">No friends yet 🚀</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsListPopup;
