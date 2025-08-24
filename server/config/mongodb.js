import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('DB CONNECTED'));
        await mongoose.connect(`${process.env.MONGODB_URI}/blog-app`)
    } catch (error) {
        console.log(error);
    }

}
export default connectDB;