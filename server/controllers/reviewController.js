const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Order = require('../models/Order');

const getProductReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Review.countDocuments({ product: req.params.productId });
  res.status(200).json({ success: true, total, reviews });
});

const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const existing = await Review.findOne({ user: req.user._id, product: productId });
  if (existing) { res.status(400); throw new Error('You have already reviewed this product'); }
  // Check if verified purchase
  const order = await Order.findOne({ user: req.user._id, 'orderItems.product': productId, isDelivered: true });
  const review = await Review.create({
    ...req.body,
    user: req.user._id,
    product: productId,
    isVerifiedPurchase: !!order,
  });
  await review.populate('user', 'name avatar');
  res.status(201).json({ success: true, review });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  if (review.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized'); }
  Object.assign(review, req.body);
  await review.save();
  res.status(200).json({ success: true, review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  await review.deleteOne();
  await Review.calcAverageRatings(review.product);
  res.status(200).json({ success: true, message: 'Review deleted' });
});

module.exports = { getProductReviews, addReview, updateReview, deleteReview };
