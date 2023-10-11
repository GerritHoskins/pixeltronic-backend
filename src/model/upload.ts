import Mongoose from 'mongoose';

const UploadSchema = new Mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  file: {
    data: Buffer,
    contentType: String,
  },
  uploadTime: {
    type: Date,
    default: Date.now,
  },
});

const Upload = Mongoose.model('upload', UploadSchema);
export default Upload;
