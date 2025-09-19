import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import avatarIcon from "../../assets/avatar_icon.png";
import {
  addFriend as apiAddFriend,
  deleteFriend as apiDeleteFriend,
  searchForUsers,
} from "../../api/userApi";
import { getAllChats } from "../../api/chatApi";
import useAuthStore from "../../store/useAuthStore";

const Sidebar = ({ onSelect }) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [activeTab, setActiveTab] = useState("chats"); // chats | friends | search
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // safe extractor for axios responses
  const extractData = (res) => {
    if (!res) return null;
    if (Array.isArray(res.data)) return res.data;
    if (res.data?.data) return res.data.data;
    return res.data;
  };

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const res = await getAllChats();
      const data = extractData(res);
      setChats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchChats error:", err);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // search by username (or whatever backend expects)
  const handleSearch = async () => {
    const q = searchInput.trim();
    if (!q) return;
    setLoadingSearch(true);
    try {
      const res = await searchForUsers(q);
      const data = extractData(res);
      setSearchResults(Array.isArray(data) ? data : data ? [data] : []);
      setActiveTab("search");
    } catch (err) {
      console.error("search error:", err);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  // add friend (asks for custom name)
  const handleAddFriend = async (foundUser, e) => {
    if (e) e.stopPropagation();
    const friendName = prompt(`Enter a custom name for ${foundUser.username}:`);
    if (!friendName) return;
    try {
      await apiAddFriend(foundUser.email, friendName);
      // update zustand user friends immediately (so button hides)
      const newFriend = { ...foundUser, friendName };
      setUser({
        ...user,
        friends: [...(user?.friends || []), newFriend],
      });
      // mark the search result as justAdded (instant UI feedback)
      setSearchResults((prev) =>
        prev.map((u) =>
          u._id === foundUser._id ? { ...u, justAdded: true } : u
        )
      );
    } catch (err) {
      console.error("addFriend error:", err);
    }
  };

  // delete friend
  const handleDeleteFriend = async (friendId, e) => {
    if (e) e.stopPropagation();
    const confirmDelete = window.confirm("Delete this friend?");
    if (!confirmDelete) return;
    try {
      await apiDeleteFriend(friendId);
      setUser({
        ...user,
        friends: (user?.friends || []).filter((f) => f._id !== friendId),
      });
    } catch (err) {
      console.error("deleteFriend error:", err);
    }
  };

  // exit search tab
  const exitSearch = () => {
    setSearchInput("");
    setSearchResults([]);
    setActiveTab("chats");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-tabs">
          <button
            className={activeTab === "chats" ? "tab active" : "tab"}
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </button>

          <button
            className={activeTab === "friends" ? "tab active" : "tab"}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </button>
        </div>

        <div className="sidebar-search">
          <input
            placeholder="Search username..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            aria-label="Search users"
          />
          <button onClick={handleSearch} className="search-btn">
            🔍
          </button>
        </div>

        {activeTab === "search" && (
          <div className="exit-search">
            <button onClick={exitSearch} className="exit-btn">
              ❌ Exit
            </button>
          </div>
        )}
      </div>

      <div className="sidebar-list scrollbar">
        {/* CHATS */}
        {activeTab === "chats" && (
          <>
            {loadingChats ? (
              <div className="muted">Loading chats...</div>
            ) : chats.length === 0 ? (
              <div className="muted">No chats yet</div>
            ) : (
              chats.map((c) => (
                <div
                  key={c._id}
                  className="sidebar-item"
                  onClick={() => onSelect?.(c, "chat")}
                >
                  <div className="sidebar-item-left">
                    <div className="circle-icon" />
                    <div className="sidebar-item-body">
                      <div className="sidebar-item-title small">
                        {c.name ||
                          (c.participants && c.participants[0]?.username) ||
                          "Chat"}
                      </div>
                      <div className="sidebar-item-sub smaller">
                        {c.lastMessage ? c.lastMessage.text : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* FRIENDS */}
        {activeTab === "friends" && (
          <>
            {(user?.friends || []).length === 0 ? (
              <div className="muted">No friends yet</div>
            ) : (
              user.friends.map((f) => (
                <div
                  key={f._id}
                  className="sidebar-item"
                  onClick={() => onSelect?.(f, "friend")}
                >
                  <div className="sidebar-item-left">
                    <img
                      src={f.profilePicture || f.avatar || avatarIcon}
                      alt={f.username}
                      className="small-avatar"
                    />
                    <div className="sidebar-item-body">
                      <div className="sidebar-item-title small">
                        {f.username}
                      </div>
                      <div className="sidebar-item-sub smaller">
                        {f.friendName || f.email}
                      </div>
                    </div>
                  </div>

                  <div className="sidebar-item-actions">
                    <button
                      className="text-btn small-btn"
                      onClick={(e) => handleDeleteFriend(f.friend, e)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* SEARCH */}
        {activeTab === "search" && (
          <>
            {loadingSearch ? (
              <div className="muted">Searching...</div>
            ) : searchResults.length === 0 ? (
              <div className="muted">No results</div>
            ) : (
              searchResults.map((u) => {
                const isFriend = (user?.friends || []).some(
                  (f) => f._id === u._id || f.email === u.email
                );
                return (
                  <div
                    key={u._id || u.email}
                    className="sidebar-item"
                    // optional: open profile or start chat on click
                    onClick={() => onSelect?.(u, "friend")}
                  >
                    <div className="sidebar-item-left">
                      <img
                        src={u.profilePicture || u.avatar || avatarIcon}
                        alt={u.username}
                        className="small-avatar"
                      />
                      <div className="sidebar-item-body">
                        <div className="sidebar-item-title small">
                          {u.username}
                        </div>
                        <div className="sidebar-item-sub smaller">
                          {u.email}
                        </div>
                      </div>
                    </div>

                    <div className="sidebar-item-actions">
                      {!isFriend && !u.justAdded && (
                        <button
                          className="primary small-btn"
                          onClick={(e) => handleAddFriend(u, e)}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
