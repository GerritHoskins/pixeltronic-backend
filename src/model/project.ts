import Mongoose from 'mongoose';
const ProjectSchema = new Mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  img: {
    data: Buffer,
    contentType: String,
    required: true,
  },
});

const Project = Mongoose.model('project', ProjectSchema);
export default Project;
