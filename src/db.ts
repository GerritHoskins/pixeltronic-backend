import Mongoose from 'mongoose';

const username = encodeURIComponent("");
const password = encodeURIComponent("");
const cluster = "";

const uri = `mongodb+srv://${username}:${password}@${cluster}/`;

const connectDB = async () => {
    try {
        await Mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
};

export default connectDB;
