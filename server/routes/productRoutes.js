const express = require('express');
const router = express.Router();
const {
  getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct,
  getFeaturedProducts, getSearchSuggestions, getRecommendations,
} = require('../controllers/productController');
const { getCategories } = require('../controllers/categoryController');
const { protect, admin, vendor } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/categories', getCategories);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/recommendations', getRecommendations);

// Base products route
router.get('/', getProducts);
router.post('/', protect, vendor, createProduct);

// Parameterized product routes
router.get('/:id', getProductBySlug);
router.put('/:id', protect, vendor, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
