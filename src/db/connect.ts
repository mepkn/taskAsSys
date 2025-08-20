import mongoose from "mongoose";

const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

export default connectDB;
