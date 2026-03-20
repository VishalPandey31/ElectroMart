const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const Category = require('./models/Category');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const pCount = await Product.countDocuments();
  const cCount = await Category.countDocuments();
  const categories = await Category.find();
  const sampleProduct = await Product.findOne().populate('category');

  console.log('--- DATABASE STATUS ---');
  const activeCount = await Product.countDocuments({ isActive: true });
  console.log('Total Products:', pCount);
  console.log('Active Products:', activeCount);
  if (sampleProduct) {
    console.log('Sample Product ID:', sampleProduct._id);
    console.log('Sample Product Name:', sampleProduct.name);
    console.log('isActive value:', sampleProduct.isActive);
    console.log('isActive type:', typeof sampleProduct.isActive);
  }
  process.exit(0);
}

check();
