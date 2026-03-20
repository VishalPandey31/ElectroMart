const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function checkCollections() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  
  console.log('--- COLLECTIONS IN DB ---');
  for (let col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`- ${col.name}: ${count} docs`);
  }
  process.exit(0);
}

checkCollections().catch(console.error);
