const User = require("../models/User");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("name email role isVerified isActive createdAt");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getAllUsers,
};