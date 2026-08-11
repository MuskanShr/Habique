import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(process.env.MONGO_URL);

    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed:", error.message);
    process.exit(1);
  }
};
