const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: String,
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number }, // cap for percentage discounts
    minOrderAmount: { type: Number, default: 0 },
    maxUses: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function (userId, orderAmount) {
  if (!this.isActive) return { valid: false, message: 'Coupon is not active' };
  if (this.expiresAt < new Date()) return { valid: false, message: 'Coupon has expired' };
  if (this.maxUses && this.usedCount >= this.maxUses) return { valid: false, message: 'Coupon usage limit reached' };
  if (this.usedBy.includes(userId)) return { valid: false, message: 'You have already used this coupon' };
  if (orderAmount < this.minOrderAmount)
    return { valid: false, message: `Minimum order amount is ₹${this.minOrderAmount}` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (orderAmount) {
  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (orderAmount * this.discountValue) / 100;
    if (this.maxDiscountAmount) discount = Math.min(discount, this.maxDiscountAmount);
  } else {
    discount = this.discountValue;
  }
  return Math.min(discount, orderAmount);
};

module.exports = mongoose.model('Coupon', couponSchema);
