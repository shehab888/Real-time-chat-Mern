const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "the username must be required"],
      // unique: [true, "the username must be unique"],
      trim: true,
      minlength: [3, "the name min length is 3 chars"],
      maxlength: [20, "the name max length is 20 chars"],
    },
    // phoneNumber: {
    //   type: Number,
    //   required: [true, "the phone number is needed"],
    //   unique: [true, "the phone number must be unique"],
    //   minlength: [11, "the min length of the number is 11 num"],
    //   maxlength: [11, "the max length of the number is 11 num"],
    // },
    email: {
      type: String,
      required: [true, "the email must be required"],
      unique: [true, "the email  must be unique"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "the password is required"],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [200, "max length of the bio is 200 chars only"],
      default: "",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        customName: {
          type: String,
          required: true,
          trim: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
      { _id: false },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    privacy: {
      lastSeen: {
        type: String,
        enum: ["everyone", "contacts", "nobody"],
        default: "everyone",
      },
      profilePhoto: {
        type: String,
        enum: ["everyone", "contacts", "nobody"],
        default: "everyone",
      },
      about: {
        type: String,
        enum: ["everyone", "contacts", "nobody"],
        default: "everyone",
      },
    },
  },
  {
    timestamps: true,
  }
);
userSchema.index({ username: 1 });
// userSchema.index({ email: 1 });
const User = mongoose.model("User", userSchema);

module.exports = User;
