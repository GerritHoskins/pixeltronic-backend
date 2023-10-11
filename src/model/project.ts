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
  file: {
    type: String,
  },
});

const Project = Mongoose.model('project', ProjectSchema);
export default Project;
