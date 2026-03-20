const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const sendEmail = require('../utils/sendEmail');

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, couponCode, discountAmount } = req.body;
  if (!orderItems || orderItems.length === 0) { res.status(400); throw new Error('No order items'); }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice: taxPrice || 0,
    totalPrice,
    couponCode,
    discountAmount: discountAmount || 0,
  });

  // Update product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, soldCount: item.quantity },
    });
  }

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponCode: null, couponDiscount: 0 });

  // Send confirmation email
  sendEmail({
    email: req.user.email,
    subject: `Order Confirmed - ${order.orderNumber}`,
    html: `<h2>Order Confirmed! 🎉</h2><p>Order #${order.orderNumber} has been placed successfully. Total: ₹${totalPrice}</p>`,
  }).catch(console.error);

  res.status(201).json({ success: true, order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, orders });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.status(200).json({ success: true, order });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.status(200).json({ success: true, total, orders });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, trackingUrl } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (trackingUrl) order.trackingUrl = trackingUrl;
  if (status === 'delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }
  await order.save();
  res.status(200).json({ success: true, order });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (!['pending', 'confirmed'].includes(order.status)) {
    res.status(400); throw new Error('Order cannot be cancelled at this stage');
  }
  order.status = 'cancelled';
  order.cancelReason = req.body.reason;
  // Restore stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, soldCount: -item.quantity } });
  }
  await order.save();
  res.status(200).json({ success: true, order });
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder };
