import React, { useState, useEffect } from "react";
import "./ProfileUpdate.css";
import avatarIcon from "../../assets/avatar_icon.png"; // استيراد الصورة
const Profile = () => {
  const [avatar, setAvatar] = useState(""); // الرابط بدل الصورة المحلية
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://real-time-chat-backend-production-6f5c.up.railway.app/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();
        console.log("data=============",data)
        if (res.ok) {
          setName(data.name || data.data?.username || "");
          setEmail(data.email || data.data?.email || "");
          setBio(data.bio || data.data?.bio || "");
          setAvatar(data.profilePicture || data.data?.profilePicture || "");
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("❌ Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, bio, profilePicture: avatar }),
      });

      const data = await res.json();
      if (res.ok) setSuccess("✅ Profile updated successfully!");
      else setError(data.message || "Failed to update profile");
    } catch (err) {
      setError("❌ Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>⏳ Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container">
      <div className="profile-container">
        <h1 className="title">My Profile</h1>

        {/* Profile Image الدائرية */}
        <div className="profile-pic">
          <img
            src={avatar || avatarIcon} // صورة افتراضية لو مفيش رابط
            alt="Profile"
            className="avatar-circle"
          />
        </div>

        {/* Info Form */}
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Input للرابط */}
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
  );
};

export default Profile;
