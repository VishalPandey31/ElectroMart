const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { sendTokenResponse } = require('../middleware/authMiddleware');

// @desc   Register user
// @route  POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered');
  }
  const user = await User.create({ name, email, password, phone });

  // Send welcome email (don't await to avoid blocking response)
  sendEmail({
    email: user.email,
    subject: 'Welcome to ElectroMart! 🎉',
    html: `<h2>Welcome, ${user.name}!</h2><p>Your account has been created successfully. Happy shopping!</p>`,
  }).catch(console.error);

  sendTokenResponse(user, 201, res);
});

// @desc   Login user
// @route  POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (!user.isActive) {
    res.status(401);
    throw new Error('Your account has been deactivated');
  }
  sendTokenResponse(user, 200, res);
});

// @desc   Logout user
// @route  POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc   Get current logged in user
// @route  GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images price discountPrice slug');
  res.status(200).json({ success: true, user });
});

// @desc   Update profile
// @route  PUT /api/auth/update-profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone },
    { new: true, runValidators: true }
  );
  res.status(200).json({ success: true, user });
});

// @desc   Change password
// @route  PUT /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc   Forgot password
// @route  POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error('No user found with that email');
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}" style="background:#6366f1;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;">Reset Password</a>
    <p>This link expires in 10 minutes. If you didn't request this, please ignore this email.</p>
  `;

  try {
    await sendEmail({ email: user.email, subject: 'ElectroMart - Password Reset', html });
    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc   Reset password
// @route  POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc   Add/Update address
// @route  POST /api/auth/address
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc   Delete address
// @route  DELETE /api/auth/address/:id
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.id);
  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

module.exports = {
  register, login, logout, getMe, updateProfile, changePassword,
  forgotPassword, resetPassword, addAddress, deleteAddress,
};
