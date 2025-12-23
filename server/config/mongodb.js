import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('DB already connected');
        return;
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/blog-app`);

        isConnected = db.connections[0].readyState;

        console.log('DB CONNECTED');
    } catch (error) {
        console.log(error);
    }
}
export default connectDB;