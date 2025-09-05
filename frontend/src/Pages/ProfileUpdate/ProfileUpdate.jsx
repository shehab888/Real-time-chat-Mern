import React, { useState } from "react";
import "./ProfileUpdate.css"; 
import avatarIcon from "../../assets/avatar_icon.png"; // استيراد الصورة

const Profile = () => {
  const [avatar, setAvatar] = useState(avatarIcon);
  const [name, setName] = useState("Mohanad Refaye");
  const [email] = useState("mohanad@email.com"); // ثابت
  const [bio, setBio] = useState("Front-end Developer 🚀");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ Profile Saved!\n\nName: ${name}\nEmail: ${email}\nBio: ${bio}`);
  };

  return (
    <div className="container">
      <div className="profile-container">
        <h1 className="title">My Profile</h1>

        {/* Profile Image */}
        <div className="profile-pic">
          <img src={avatar} alt="Profile" />
          <input
            type="file"
            id="upload"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
          <button onClick={() => document.getElementById("upload").click()}>
            Change
          </button>
        </div>

        {/* Info Form */}
        <form className="profile-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input type="email" value={email} disabled />

          <label>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
