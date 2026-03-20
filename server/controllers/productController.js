const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc   Get all products with filters, sorting, pagination
// @route  GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, rating, brand, inStock, sort, page = 1, limit = 12, featured } = req.query;

  const query = { isActive: true };

  // Text search
  if (keyword) {
    query.$text = { $search: keyword };
  }

  // Category filter (including subcategories)
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) {
      const childCats = await Category.find({ parent: cat._id }).select('_id');
      const catIds = [cat._id, ...childCats.map((c) => c._id)];
      query.category = { $in: catIds };
    }
  }

  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Rating filter
  if (rating) {
    query.ratings = { $gte: Number(rating) };
  }

  // Brand filter
  if (brand) {
    query.brand = { $regex: brand, $options: 'i' };
  }

  // Stock filter
  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  // Featured
  if (featured === 'true') {
    query.featured = true;
  }

  // Sorting
  let sortOptions = { createdAt: -1 };
  if (sort === 'price-asc') sortOptions = { price: 1 };
  else if (sort === 'price-desc') sortOptions = { price: -1 };
  else if (sort === 'rating') sortOptions = { ratings: -1 };
  else if (sort === 'popular') sortOptions = { soldCount: -1 };
  else if (sort === 'newest') sortOptions = { createdAt: -1 };

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    products,
  });
});

// @desc   Get product by slug or ID
// @route  GET /api/products/slug/:slug  OR  GET /api/products/:id
const getProductBySlug = asyncHandler(async (req, res) => {
  const param = req.params.slug || req.params.id;
  const isObjectId = /^[a-f\d]{24}$/i.test(param);

  const product = await Product.findOne(
    isObjectId ? { _id: param, isActive: true } : { slug: param, isActive: true }
  )
    .populate('category', 'name slug')
    .populate('vendor', 'name')
    .populate({ path: 'relatedProducts', select: 'name price discountPrice images slug ratings' });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json({ success: true, product });
});

// @desc   Create product
// @route  POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  req.body.vendor = req.user._id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc   Update product
// @route  PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (req.user.role !== 'admin' && product.vendor?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, product });
});

// @desc   Delete product
// @route  DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted' });
});

// @desc   Get featured products
// @route  GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true, isActive: true, stock: { $gt: 0 } })
    .populate('category', 'name slug')
    .limit(12)
    .lean();
  res.status(200).json({ success: true, products });
});

// @desc   Get product search suggestions
// @route  GET /api/products/suggestions
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ success: true, suggestions: [] });
  const products = await Product.find({
    name: { $regex: q, $options: 'i' },
    isActive: true,
  })
    .select('name slug images price discountPrice')
    .limit(8)
    .lean();
  res.status(200).json({ success: true, suggestions: products });
});

// @desc   Get recommendations (simple rule-based)
// @route  GET /api/products/:id/recommendations
const getRecommendations = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.json({ success: true, products: [] });
  const products = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isActive: true,
    stock: { $gt: 0 },
  })
    .select('name slug price discountPrice images ratings')
    .limit(6)
    .lean();
  res.status(200).json({ success: true, products });
});

module.exports = {
  getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct,
  getFeaturedProducts, getSearchSuggestions, getRecommendations,
};
