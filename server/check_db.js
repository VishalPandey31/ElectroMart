const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'c:/Users/Vishal/OneDrive/Desktop/Shopfiy1/server/.env' });

const Product = require('./models/Product');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  const products = await Product.find({}).limit(20).select('name images').lean();
  products.forEach(p => {
    console.log(`Product: ${p.name}`);
    console.log(`URL: ${p.images?.[0]?.url}`);
    console.log('---');
  });
  process.exit(0);
}

check();
