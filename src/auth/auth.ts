// @ts-ignore
import {compare, hash} from 'bcryptjs';
import User from '../model/user';

type RequestBody = {
    username?: string;
    password?: string;
    role?: string;
    id?: string;
};

type RequestType = { body: RequestBody };
type ResponseType = { status: (code: number) => ResponseType; json: (body: any) => void };
type NextFunction = (err?: any) => void;

export const register = async (req: RequestType, res: ResponseType, next: NextFunction) => {
    const {username, password} = req.body;
    if (password && password.length < 6) {
        return res.status(400).json({message: "Password less than 6 characters"});
    }
    try {
        const hashedPassword = await hash(password!, 10);
        const user = await User.create({username, password: hashedPassword});
        return res.status(200).json({message: "User successfully created", user});
    } catch (error) {
        console.error(error);
        return res.status(400).json({message: "User creation failed"});
    }
}

export const login = async (req: RequestType, res: ResponseType, next: NextFunction) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Username or Password not provided"});
    }
    try {
        const user = await User.findOne({username});
        if (!user || !(await compare(password, user.password))) {
            return res.status(400).json({message: "Login not successful"});
        }
        return res.status(200).json({message: "Login successful", user});
    } catch (error) {
        console.error(error);
        return res.status(400).json({message: "Login failed"});
    }
}

export const update = async (req: RequestType, res: ResponseType, next: NextFunction) => {
    const {role, id} = req.body;
    if (!role || !id) {
        return res.status(400).json({message: "Role or Id not provided"});
    }
    try {
        const user = await User.findById(id);
        if (!user || user.role === role) {
            return res.status(400).json({message: `User not found or already has role: ${role}`});
        }
        user.role = role;
        await user.save();
        return res.status(200).json({message: "Update successful", user});
    } catch (error) {
        console.error(error);
        return res.status(400).json({message: "Update failed"});
    }
}

export const deleteUser = async (req: RequestType, res: ResponseType, next: NextFunction) => {
    const {id} = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }
        await user.deleteOne();
        return res.status(200).json({message: "User successfully deleted"});
    } catch (error) {
        console.error(error);
        return res.status(400).json({message: "Delete failed"});
    }
}
