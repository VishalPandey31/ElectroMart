const express = require('express');
const router = express.Router({ mergeParams: true });
const { getProductReviews, addReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProductReviews).post(protect, addReview);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);
module.exports = router;
