import 'dotenv/config';
import { compare, hash } from 'bcryptjs';
import { JwtPayload, Secret, sign, verify, VerifyOptions } from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../model/user';
import { Env, getEnv } from '../config/env';
import type { NextFunction, Request, Response } from 'express';

const verifyPromise = promisify<string, Secret, VerifyOptions | undefined, JwtPayload | string>(verify);
const jwtSecretLive = getEnv(Env.JWT_SECRET_LIVE);

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const hashedPassword = await hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    const maxAge = 3 * 60 * 60;
    const token = sign({ id: user._id, username, role: user.role }, jwtSecretLive, {
      expiresIn: maxAge,
    });
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ message: 'User successfully created', user: user._id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'User creation failed', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username or Password not provided' });
  }

  try {
    const user = await User.findOne({ username });
    if (user && (await compare(password, user.password))) {
      const maxAge = 3 * 60 * 60;
      const token = sign({ id: user._id, username, role: user.role }, jwtSecretLive, {
        expiresIn: maxAge,
      });
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ message: 'Successfully logged in', user: user._id });
    } else {
      res.status(400).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Login failed' });
  }
};
export const update = async (req: Request, res: Response) => {
  const { role, id } = req.body;
  if (!role || !id) {
    return res.status(400).json({ message: 'Role or Id not provided' });
  }
  try {
    const user = await User.findById(id);
    if (!user || user.role === role) {
      return res.status(400).json({ message: `User not found or already has role: ${role}` });
    }
    user.role = role;
    await user.save();
    return res.status(200).json({ message: 'Update successful', user });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Update failed' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    await user.deleteOne();
    return res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Delete failed' });
  }
};

const auth = (role: string) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token not available' });
    }
    let decodedToken: JwtPayload | string;
    try {
      decodedToken = await verifyPromise(token, jwtSecretLive, undefined);
    } catch (err) {
      return res.status(401).json({ message: 'Token verification failed' });
    }
    if (typeof decodedToken !== 'string' && decodedToken.role !== role) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

export const adminAuth = auth('admin');
export const userAuth = auth('Basic');

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    const userFunction = users.map((user) => ({
      username: user.username,
      role: user.role,
    }));

    res.status(200).json({ user: userFunction });
  } catch (err) {
    res.status(401).json({ message: 'Not successful' });
  }
};
