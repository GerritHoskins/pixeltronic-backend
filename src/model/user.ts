import Mongoose from 'mongoose';

const UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
    required: true,
  },
});

const User = Mongoose.model('user', UserSchema);
export default User;
