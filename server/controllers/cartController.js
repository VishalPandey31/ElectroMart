const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price discountPrice stock slug');
  res.status(200).json({ success: true, cart: cart || { items: [], subtotal: 0 } });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) { res.status(404); throw new Error('Product not found'); }
  if (product.stock < quantity) { res.status(400); throw new Error('Insufficient stock'); }

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity, price }] });
  } else {
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = price;
    } else {
      cart.items.push({ product: productId, quantity, price });
    }
    await cart.save();
  }

  const populated = await Cart.findById(cart._id).populate('items.product', 'name images price discountPrice stock slug');
  res.status(200).json({ success: true, cart: populated });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) { res.status(404); throw new Error('Item not in cart'); }
  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product', 'name images price discountPrice stock slug');
  res.status(200).json({ success: true, cart: populated });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product', 'name images price discountPrice stock slug');
  res.status(200).json({ success: true, cart: populated });
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponCode: null, couponDiscount: 0 });
  res.status(200).json({ success: true, message: 'Cart cleared' });
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart is empty'); }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) { res.status(404); throw new Error('Invalid coupon code'); }

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const validation = coupon.isValid(req.user._id, subtotal);
  if (!validation.valid) { res.status(400); throw new Error(validation.message); }

  const discount = coupon.calculateDiscount(subtotal);
  cart.couponCode = coupon.code;
  cart.couponDiscount = discount;
  await cart.save();

  res.status(200).json({ success: true, discount, message: `Coupon applied! You save ₹${discount.toFixed(2)}` });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon };
