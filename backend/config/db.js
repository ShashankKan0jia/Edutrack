const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable is required");
    process.exit(1);
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch {
    // Connection errors can include infrastructure details; keep logs generic.
    console.error("MongoDB connection failed. Check MONGO_URI and database availability.");
    process.exit(1);
  }
};

module.exports = connectDB;
