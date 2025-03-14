import mongoose from "mongoose";
import { DATABASE_NAME, DATABASE_URI } from "../constants.js";

const connectDB = async () => {
  try {
    console.log("Waiting for database connection ...");
    await mongoose.connect(`${DATABASE_URI}/${DATABASE_NAME}`);
    console.log("\nDATABASE connected !!");
  } catch (error) {
    console.log("DATABASE connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
