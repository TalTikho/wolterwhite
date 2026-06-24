import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://wolterwhite-mongo:27017/wolterwhite';;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // fail fast — there's no point serving requests without a DB
    }
};