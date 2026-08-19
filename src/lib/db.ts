import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000,
    };

    const targetUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dreamsmith";

    cached.promise = (async () => {
      try {
        const conn = await mongoose.connect(targetUri, opts);
        return conn;
      } catch (err: any) {
        if (process.env.NODE_ENV === "production") {
          cached.promise = null;
          throw err;
        }

        console.warn("Local MongoDB unavailable, falling back to an in-memory database (dev only):", err.message);
        try {
          const { MongoMemoryServer } = await import("mongodb-memory-server");
          const mongoServer = await MongoMemoryServer.create();
          const memUri = mongoServer.getUri();
          console.log("In-memory MongoDB started at:", memUri);
          const conn = await mongoose.connect(memUri, { bufferCommands: false });
          return conn;
        } catch (memErr) {
          cached.promise = null;
          throw memErr;
        }
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;
