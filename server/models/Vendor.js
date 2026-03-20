const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    storeName: { type: String, required: true, trim: true },
    storeDescription: String,
    logo: String,
    banner: String,
    contactEmail: String,
    contactPhone: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    gstNumber: String,
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
    commissionRate: { type: Number, default: 10 }, // percentage
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
