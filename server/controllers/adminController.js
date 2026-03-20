const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

// @desc  Get dashboard analytics
// @route GET /api/admin/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const [totalRevenue, totalOrders, totalUsers, totalProducts, recentOrders, topProducts, ordersByStatus] =
    await Promise.all([
      Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Product.find().sort({ soldCount: -1 }).limit(5).select('name soldCount price images'),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

  // Monthly revenue for chart (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRevenue = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalUsers,
      totalProducts,
    },
    recentOrders,
    topProducts,
    monthlyRevenue,
    ordersByStatus,
  });
});

// @desc  Get all users (admin)
// @route GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  const total = await User.countDocuments(query);
  const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
  res.status(200).json({ success: true, total, users });
});

// @desc  Update user role
// @route PUT /api/admin/users/:id
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role, isActive: req.body.isActive }, { new: true });
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.status(200).json({ success: true, user });
});

// @desc  Get vendor list
// @route GET /api/admin/vendors
const getVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json({ success: true, vendors });
});

// @desc  Approve/reject vendor
// @route PUT /api/admin/vendors/:id
const updateVendorStatus = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status: req.body.status, isActive: req.body.status === 'approved' }, { new: true });
  if (!vendor) { res.status(404); throw new Error('Vendor not found'); }
  if (req.body.status === 'approved') {
    await User.findByIdAndUpdate(vendor.user, { role: 'vendor' });
  }
  res.status(200).json({ success: true, vendor });
});

module.exports = { getAnalytics, getAllUsers, updateUserRole, getVendors, updateVendorStatus };
