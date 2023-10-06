import Mongoose from 'mongoose';

const ProjectSchema = new Mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  desc: {
    type: String,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Project = Mongoose.model('project', ProjectSchema);
export default Project;
