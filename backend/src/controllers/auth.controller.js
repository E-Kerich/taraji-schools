// src/controllers/auth.controller.js
const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};
