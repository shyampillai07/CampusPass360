const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {

    throw new Error('MONGODB_URI is not set. Check your .env file.');
  }


  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);

  console.log(`[db] connected to MongoDB Atlas (db: ${mongoose.connection.name})`);


  mongoose.connection.on('error', (err) => {
    console.error('[db] connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected');
  });
}

module.exports = connectDB;