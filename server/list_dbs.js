const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function findDbs() {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = mongoose.connection.db.admin();
  const dbs = await admin.listDatabases();
  console.log('--- CLUSTER DATABASES ---');
  dbs.databases.forEach(db => {
    console.log(`- ${db.name}`);
  });
  process.exit(0);
}

findDbs().catch(err => {
  console.error(err);
  process.exit(1);
});
