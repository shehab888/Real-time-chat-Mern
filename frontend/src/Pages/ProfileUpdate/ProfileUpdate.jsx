import React, { useState, useEffect } from "react";
import "./ProfileUpdate.css";
import { Link } from "react-router-dom";
import avatarIcon from "../../assets/avatar_icon.png";

import useAuthStore from "../../store/useAuthStore";
import { updateUserProfile } from "../../api/userApi";
import { getMe } from "../../api/authApi";

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [avatar, setAvatar] = useState(user?.profilePicture || "");
  const [username, setName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🟢 لو اليوزر مش متخزن في zustand (مثلاً بعد refresh) نجيبه من auth/me
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMe();
        setUser(res.data.data);

        setName(res.data.data.username || "");
        setEmail(res.data.data.email || "");
        setBio(res.data.data.bio || "");
        setAvatar(res.data.data.profilePicture || "");
      } catch (err) {
        setError(`❌ Error fetching profile ${err.message || ""}`);
      }
    };

    if (!user) fetchProfile();
  }, [user, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 🟢 تحديث البيانات
      await updateUserProfile({
        username,
        bio,
        profilePicture: avatar,
      });

      // 🟢 نجيب النسخة الجديدة ونخزنها في zustand
      const res = await getMe();
      setUser(res.data.data);

      setSuccess("✅ Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>⏳ Saving changes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <div className="ProfilePage">
        <div className="back-link">
          <Link to="/chat">←</Link>
        </div>

        <div className="container">
          <div className="profile-container">
            <h1 className="title">My Profile</h1>

            {/* Profile Image الدائرية */}
            <div className="profile-pic">
              <img
                src={avatar || avatarIcon}
                alt="Profile"
                className="avatar-circle"
              />
            </div>

            {/* Info Form */}
            <form className="profile-form" onSubmit={handleSubmit}>
              <label>Profile Image URL</label>
              <input
                type="text"
                placeholder="Paste image URL here"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />

              <label>Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />

              <label>Email</label>
              <input type="email" value={email} disabled />

              <label>Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

              <button type="submit" className="save-btn">
                Save Changes
              </button>
              {success && <p style={{ color: "green" }}>{success}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
