const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc  Create Razorpay order
// @route POST /api/payment/razorpay/create-order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body; // amount in paise (INR * 100)
  const options = {
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: `order_${Date.now()}`,
  };
  const order = await razorpay.orders.create(options);
  res.status(200).json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
});

// @desc  Verify Razorpay payment
// @route POST /api/payment/razorpay/verify
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  // Update order in DB
  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      isPaid: true,
      paidAt: Date.now(),
      status: 'confirmed',
      paymentResult: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid',
        paidAt: new Date(),
      },
    },
    { new: true }
  );

  res.status(200).json({ success: true, message: 'Payment verified successfully', order });
});

// @desc  Place COD order
// @route POST /api/payment/cod
const placeCODOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status: 'confirmed', paymentMethod: 'cod' },
    { new: true }
  );
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.status(200).json({ success: true, message: 'COD order placed successfully', order });
});

// @desc  Get Razorpay key
// @route GET /api/payment/razorpay/key
const getRazorpayKey = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, key: process.env.RAZORPAY_KEY_ID });
});

module.exports = { createRazorpayOrder, verifyRazorpayPayment, placeCODOrder, getRazorpayKey };
