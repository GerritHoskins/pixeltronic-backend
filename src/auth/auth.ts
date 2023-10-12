import 'dotenv/config';
import { compare, hash } from 'bcryptjs';
import { JwtPayload, Secret, sign, verify, VerifyOptions } from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../model/user';
import { Env, getEnv } from '../config/env';
import type { NextFunction, Request, Response } from 'express';

const verifyPromise = promisify<string, Secret, VerifyOptions | undefined, JwtPayload | string>(verify);
const jwtSecretLive = getEnv(Env.JWT_SECRET_LIVE);

const generateToken = (user: any) => {
  const maxAge = 3 * 60 * 60;
  const tokenPayload = { id: user._id, email: user.email, role: user.role };
  const token = sign(tokenPayload, jwtSecretLive, {
    expiresIn: maxAge,
  });

  return { token, maxAge };
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const hashedPassword = await hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    const { token, maxAge } = generateToken(user);

    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    //res.status(201).json({ message: 'User successfully created', user: { id: user._id, email, role: user.role } });
    res.status(201).json({
      token,
      user: { id: user._id, email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'User creation failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email or Password not provided' });
  }

  try {
    const user = await User.findOne({ email });
    if (user && (await compare(password, user.password))) {
      const { token, maxAge } = generateToken({ user: user });

      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({
        token,
        user: { id: user._id, email, role: user.role },
      });
    } else {
      res.status(401).json({ message: 'Invalid Email or password' }); // Change to 401 for unauthorized.
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' }); // 500 for internal server errors.
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect(200, '/');
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

export const remove = async (req: Request, res: Response) => {
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
export const userAuth = auth('user');

export const all = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    const userFunction = users.map((user) => ({
      email: user.email,
      role: user.role,
    }));

    res.status(200).json({ user: userFunction });
  } catch (err) {
    res.status(401).json({ message: 'Not successful' });
  }
};
