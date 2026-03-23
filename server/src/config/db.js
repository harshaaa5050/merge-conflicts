import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
    try {
        if (!env.MONGO_URI) {
            throw new Error('MONGO_URI is not set in environment variables')
        }
        await mongoose.connect(env.MONGO_URI)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        process.exit(1)
    }
};

export default connectDB;