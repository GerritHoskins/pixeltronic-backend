import Mongoose from 'mongoose';
import 'dotenv/config';
import { Env, getEnv } from './config/env';

//const username = encodeURIComponent(getEnv(Env.DB_USERNAME));
//const password = encodeURIComponent(getEnv(Env.DB_PASSWORD));
//const cluster = getEnv(Env.DB_CLUSTER);
//const uri = `mongodb+srv://${username}:${password}@${cluster}/`;
const localdb = getEnv(Env.DB_LOCAL);

const connectDB = async () => {
  try {
    await Mongoose.connect(localdb);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};

export default connectDB;
