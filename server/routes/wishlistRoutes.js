const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images price discountPrice slug ratings stock');
  res.status(200).json({ success: true, wishlist: user.wishlist });
}));

router.post('/:productId', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const isInWishlist = user.wishlist.includes(productId);
  if (isInWishlist) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  res.status(200).json({ success: true, added: !isInWishlist, message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist' });
}));

module.exports = router;
