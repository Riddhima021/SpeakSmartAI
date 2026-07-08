const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    targetRole: {
      type: String,
      default: "Full Stack Developer",
    },

    graduationYear: {
      type: Number,
      default: 2027,
    },

    college: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: ["React", "Node"],
    },

    avatar: {
      type: String,
      default: "",
    },

    streak: {
      type: Number,
      default: 0,
    },

    totalInterviews: {
      type: Number,
      default: 0,
    },

    averageScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);