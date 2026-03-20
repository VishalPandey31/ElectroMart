const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment, placeCODOrder, getRazorpayKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/razorpay/key', getRazorpayKey);
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/cod', protect, placeCODOrder);

module.exports = router;
