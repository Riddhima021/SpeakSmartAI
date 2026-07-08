const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      targetRole,
      graduationYear,
      college,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      targetRole,
      graduationYear,
      college,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

module.exports = {
  registerUser,
};