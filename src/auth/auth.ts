import 'dotenv/config';
// @ts-ignore
import {compare, hash} from 'bcryptjs';
// @ts-ignore
import {sign, verify} from 'jsonwebtoken';
import {promisify} from 'util';
import User from '../model/user';

type RequestType = any;
type ResponseType = any;
type NextFunction = (err?: any) => void;

const verifyPromise = promisify(verify);

const jwtSecretLive = process.env.JWT_SECRET_LIVE || '';

export const register = async (req: RequestType, res: ResponseType, next: NextFunction) => {
    const {username, password} = req.body;
    if (password && password.length < 6) {
        return res.status(400).json({message: 'Password less than 6 characters'});
    }
    try {
        hash(password, 10).then(async (hash: any) => {
            await User.create({
                username,
                password: hash,
            })
                .then((user) => {
                    const maxAge = 3 * 60 * 60;
                    const token = sign(
                        {id: user._id, username, role: user.role},
                        jwtSecretLive,
                        {
                            expiresIn: maxAge, // 3hrs in sec
                        }
                    );
                    res.cookie('jwt', token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000, // 3hrs in ms
                    });
                    res.status(201).json({
                        message: 'User successfully created',
                        user: user._id,
                    });
                })
                .catch((error) =>
                    res.status(400).json({
                        message: 'User not successful created',
                        error: error.message,
                    })
                );
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({message: 'User creation failed'});
    }
}

export const login = async (req: RequestType, res: ResponseType, next: NextFunction) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: 'Username or Password not provided'});
    }
    try {
        await User.findOne({username}).then((user) => {
            compare(password, user?.password).then((result: any) => {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = sign(
                        {id: user?._id, username, role: user?.role},
                        jwtSecretLive,
                        {
                            expiresIn: maxAge, // 3hrs in sec
                        }
                    );
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000, // 3hrs in ms
                    });
                    res.status(201).json({
                        message: "User successfully Logged in",
                        user: user?._id,
                    });
                } else {
                    res.status(400).json({message: "Login not succesful"});
                }
            });
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({message: 'Login failed'});
    }
}

export const update = async (req: RequestType, res: ResponseType, next: NextFunction) => {
    const {role, id} = req.body;
    if (!role || !id) {
        return res.status(400).json({message: 'Role or Id not provided'});
    }
    try {
        const user = await User.findById(id);
        if (!user || user.role === role) {
            return res.status(400).json({message: `User not found or already has role: ${role}`});
        }
        user.role = role;
        await user.save();
        return res.status(200).json({message: 'Update successful', user});
    } catch (error) {
        console.error(error);
        return res.status(400).json({message: 'Update failed'});
    }
}

export const deleteUser = async (req: RequestType, res: ResponseType, next: NextFunction) => {
    const {id} = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }
        await user.deleteOne();
        return res.status(200).json({message: 'User successfully deleted'});
    } catch (error) {
        console.error(error);
        return res.status(400).json({message: 'Delete failed'});
    }
}

const auth = (role: string) => async (req: RequestType, res: ResponseType, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({message: "Not authorized, token not available"});
        }

        const decodedToken: any = await verifyPromise(token, jwtSecretLive);
        if (decodedToken.role !== role) {
            return res.status(401).json({message: "Not authorized"});
        }

        next();
    } catch (err) {
        return res.status(401).json({message: "Not authorized"});
    }
};

export const adminAuth = auth('admin');
export const userAuth = auth('Basic');

export const getUsers = async (req: RequestType, res: ResponseType) => {
    try {
        const users = await User.find({});
        const userFunction = users.map(user => ({
            username: user.username,
            role: user.role
        }));

        res.status(200).json({user: userFunction});
    } catch (err) {
        res.status(401).json({message: "Not successful"});
    }
};
