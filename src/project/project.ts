import type { Request, Response } from 'express';
import Project from '../model/project';
import User from '../model/user';

const add = async (req: Request, res: Response) => {
  const { name, desc, img } = req.body;
  if (!name || !desc) {
    return res.status(400).json({ message: 'Required params not provided' });
  }

  try {
    const project = await Project.create({ name, desc, img });
    res.status(200).json({ message: 'Project successfully created', project: project.name });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`An uncaught exception occurred: ${error.message}`);
    } else {
      console.error(`An unexpected exception occurred: ${error}`);
    }

    res.status(400).json({ message: 'Project creation failed' });
  }
};

const update = async (req: Request, res: Response) => {
  const { name, desc, img } = req.body;
  if (!name || !desc || !img) {
    return res.status(400).json({ message: 'Required params not provided' });
  }
  const filter = { name };
  const update = { desc, img };
  try {
    const project = await Project.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (!project) {
      return res.status(400).json({ message: `Project not found with name: ${name}` });
    }
    project.name = name;
    project.desc = desc;
    project.img = img;
    await project.save();
    return res.status(200).json({ message: 'Update successful', project });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Update failed' });
  }
};

const remove = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const project = await User.findById(name);
    if (!project) {
      return res.status(400).json({ message: 'Project not found' });
    }
    await project.deleteOne();
    return res.status(200).json({ message: 'Project successfully deleted' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Delete failed' });
  }
};

const get = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Project name not provided' });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(400).json({ message: `Project not found with name: ${id}` });
    }

    return res.status(200).json({ message: 'Get project successful', project });
  } catch (error) {
    console.error(error);
  }
};

const all = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({});
    const projectFunction = projects.map((project) => ({
      id: project.id,
      name: project.name,
      desc: project.desc,
      img: project.img ?? '',
    }));

    res.status(200).json({ projects: projectFunction });
  } catch (error) {
    console.error(error);
  }
};

export { add, update, remove, get, all };
