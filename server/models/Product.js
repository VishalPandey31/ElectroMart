const mongoose = require('mongoose');
const slugify = require('slugify');

const specSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
    unit: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 300 },
    slug: { type: String, unique: true },
    sku: { type: String, unique: true, sparse: true },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String, maxlength: 500 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    discountPrice: { type: Number, min: 0, default: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    images: [
      {
        url: { type: String, required: true },
        publicId: String,
        alt: String,
      },
    ],
    specifications: [specSchema],
    datasheet: { type: String, default: '' }, // URL to PDF
    tags: [String],
    featured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: true },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    weight: { type: Number, default: 0 }, // in grams
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    shippingClass: { type: String, enum: ['standard', 'fragile', 'oversized'], default: 'standard' },
    soldCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    // For multi-category support
    subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // Application tags (IoT, Robotics, etc.)
    applications: [String],
    // Voltage/current for electronics
    voltage: String,
    current: String,
    protocol: String, // I2C, SPI, UART etc.
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Generate slug before save
productSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Calculate discount percentage virtual
productSchema.virtual('discountPercentage').get(function () {
  if (this.discountPrice && this.price > 0) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Final price virtual
productSchema.virtual('finalPrice').get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

// Low stock virtual
productSchema.virtual('isLowStock').get(function () {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1, ratings: -1 });
productSchema.index({ featured: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
