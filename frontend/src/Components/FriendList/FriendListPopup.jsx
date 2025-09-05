import React from "react";
import "./FriendListPopup.css";

const FriendsListPopup = ({ friends, onRemove, onClose }) => {
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
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <div key={index} className="friend-item">
                <span>👤 {friend}</span>
                <button className="remove-btn" onClick={() => onRemove(friend)}>
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
