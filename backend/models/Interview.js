const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          default: 0,
        },

        feedback: {
          type: String,
          default: "",
        },

        idealAnswer: {
          type: String,
          default: "",
        },
      },
    ],

    answer: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["HR", "Technical", "Behavioral"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    questions: [questionSchema],

    overallScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Interview", interviewSchema);
