const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, coupons });
});
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, coupon });
});
const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Coupon deleted' });
});
const validateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.body.code?.toUpperCase() });
  if (!coupon) { res.status(404); throw new Error('Invalid coupon code'); }
  const validation = coupon.isValid(req.user._id, req.body.orderAmount || 0);
  if (!validation.valid) { res.status(400); throw new Error(validation.message); }
  const discount = coupon.calculateDiscount(req.body.orderAmount || 0);
  res.status(200).json({ success: true, discount, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue } });
});

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };
