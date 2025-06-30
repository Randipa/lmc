const mongoose = require('mongoose');

/**
 * Cached connection across Vercel serverless invocations.
 * Without caching a new connection is created for every request which can
 * quickly exhaust the database connection limit and appear as a timeout.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log('MongoDB Connected');
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        console.error('MongoDB Connection Error:', error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;