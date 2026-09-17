
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    requestCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    
    response: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    category: {
      type: String,
      required: true,
      enum: [
        "academics",
        "infrastructure",
        "hostel",
        "transport",
        "technology",
        "cleanliness",
        "other",
      ],
    },

    status: {
      type: String,
      enum: [
        "pending_review",
        "open",
        "in_progress",
        "resolved",
        "rejected",
      ],
      default: "pending_review",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);