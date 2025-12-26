import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('DB already connected');
        return;
    }

    if (!process.env.MONGODB_URI) {
        console.error('Error: MONGODB_URI is not defined in environment variables.');
        return;
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/blog-app`);

        isConnected = db.connections[0].readyState;

        console.log('DB CONNECTED');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
    }
}
export default connectDB;