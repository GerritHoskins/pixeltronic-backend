import Mongoose from 'mongoose';

const FileUploadSchema = new Mongoose.Schema({
  file: {
    data: Buffer,
    contentType: String,
  },
});

const FileUpload = Mongoose.model('file', FileUploadSchema);
export default FileUpload;
