const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

const getCategories = asyncHandler(async (req, res) => {
  const { tree } = req.query;
  if (tree === 'true') {
    // Return full tree structure
    const parents = await Category.find({ parent: null, isActive: true }).sort({ order: 1 });
    const withChildren = await Promise.all(
      parents.map(async (parent) => {
        const children = await Category.find({ parent: parent._id, isActive: true }).sort({ order: 1 });
        return { ...parent.toJSON(), children };
      })
    );
    return res.status(200).json({ success: true, categories: withChildren });
  }
  const categories = await Category.find({ isActive: true }).populate('parent', 'name slug').sort({ order: 1 });
  res.status(200).json({ success: true, categories });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate('children');
  if (!category) { res.status(404); throw new Error('Category not found'); }
  res.status(200).json({ success: true, category });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) { res.status(404); throw new Error('Category not found'); }
  res.status(200).json({ success: true, category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
