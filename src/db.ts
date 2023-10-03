import Mongoose from 'mongoose';

const username = encodeURIComponent("");
const password = encodeURIComponent("");
const cluster = "atlascluster.gim7y0m.mongodb.net";

let uri = `mongodb+srv://${username}:${password}@${cluster}/`;
const connectDB = async () => {
    await Mongoose.connect(uri);
    console.log("MongoDB Connected")
}
export default connectDB;