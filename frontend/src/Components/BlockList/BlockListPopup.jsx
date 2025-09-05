import React from "react";
import "./BlockListPopup.css";

const BlockListPopup = ({ blockedUsers, onUnblock, onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>🚫 Block List</h3>
          <button className="close-btn" onClick={onClose}>
            ❌
          </button>
        </div>

        <div className="popup-content">
          {blockedUsers.length > 0 ? (
            blockedUsers.map((user, index) => (
              <div key={index} className="blocked-user">
                <span>👤 {user}</span>
                <button
                  className="unblock-btn"
                  onClick={() => onUnblock(user)}
                >
                  🗑️ Remove
                </button>
              </div>
            ))
          ) : (
            <p className="empty-text">No blocked users 🚀</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockListPopup;
