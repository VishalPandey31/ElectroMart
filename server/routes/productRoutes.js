const express = require('express');
const router = express.Router();
const {
  getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct,
  getFeaturedProducts, getSearchSuggestions, getRecommendations,
} = require('../controllers/productController');
const { protect, admin, vendor } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/slug/:slug', getProductBySlug);
router.route('/').get(getProducts).post(protect, vendor, createProduct);
router.route('/:id').get(getProductBySlug).put(protect, vendor, updateProduct).delete(protect, admin, deleteProduct);
router.get('/:id/recommendations', getRecommendations);

module.exports = router;
