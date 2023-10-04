import Mongoose from 'mongoose';
import 'dotenv/config'

const username = encodeURIComponent(process.env.DB_USERNAME || "");
const password = encodeURIComponent(process.env.DB_PASSWORD ||"");
const cluster = process.env.DB_CLUSTER || "";

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
