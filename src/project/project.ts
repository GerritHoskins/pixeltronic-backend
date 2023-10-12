import type { Request, Response } from 'express';
import Project from '../model/project';

const handleErrors = (error: unknown, res: Response, defaultMessage: string) => {
  console.error(error);
  res.status(500).json({ message: defaultMessage });
};

const add = async (req: Request, res: Response) => {
  const { name, desc, fileName } = req.body;
  if (!name || !desc) {
    return res.status(400).json({ message: 'Required params not provided' });
  }

  try {
    const project = await Project.create({ name, desc, file: fileName });
    res.status(201).json({ message: 'Project successfully created', project: project.name });
  } catch (error) {
    handleErrors(error, res, 'Project creation failed');
  }
};

const update = async (req: Request, res: Response) => {
  const { name, desc, file } = req.body;
  if (!name || !desc || !file) {
    return res.status(400).json({ message: 'Required params not provided' });
  }

  try {
    const project = await Project.findOneAndUpdate(
      { name },
      { desc, file },
      {
        new: true,
      },
    );
    if (!project) {
      return res.status(404).json({ message: `Project not found with name: ${name}` });
    }
    res.status(200).json({ message: 'Update successful', project });
  } catch (error) {
    handleErrors(error, res, 'Update failed');
  }
};

const remove = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const project = await Project.findOne({ name });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.deleteOne();
    return res.status(200).json({ message: 'Project successfully deleted' });
  } catch (error) {
    handleErrors(error, res, 'Delete failed');
  }
};

const get = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Project ID not provided' });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: `Project not found with ID: ${id}` });
    }

    return res.status(200).json({ message: 'Get project successful', project });
  } catch (error) {
    handleErrors(error, res, 'Failed to retrieve project');
  }
};

const all = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({});
    const projectFunction = projects.map((project) => ({
      id: project.id,
      name: project.name,
      desc: project.desc,
      file: project.file ?? '',
    }));

    res.status(200).json({ projects: projectFunction });
  } catch (error) {
    handleErrors(error, res, 'Failed to retrieve all projects');
  }
};

export { add, update, remove, get, all };
