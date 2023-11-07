import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || '';

const dbConnection = () => {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('MongoDB connection success!'))
    .catch((error) => console.log(`MongoDB connection failed!, ${error}`));
};

export default dbConnection;
