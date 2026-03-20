const asyncHandler = require('express-async-handler');
const Vendor = require('../models/Vendor');

const registerVendor = asyncHandler(async (req, res) => {
  const existing = await Vendor.findOne({ user: req.user._id });
  if (existing) { res.status(400); throw new Error('Vendor profile already exists'); }
  const vendor = await Vendor.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, vendor });
});

const getMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) { res.status(404); throw new Error('Vendor profile not found'); }
  res.status(200).json({ success: true, vendor });
});

const updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOneAndUpdate({ user: req.user._id }, req.body, { new: true });
  res.status(200).json({ success: true, vendor });
});

module.exports = { registerVendor, getMyVendorProfile, updateVendorProfile };
