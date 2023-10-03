// @ts-ignore
import bcrypt from 'bcryptjs';
import User from "../model/user";

type RequestType = { body: { username: any; password: any; role: string; id: string; }; };
type ResponseType = any;
type ErrorType = any;

export const register = async (req: RequestType, res: ResponseType, next: any) => {
    const { username, password } = req.body
    if (password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" })
    }
    try {
        bcrypt.hash(password, 10).then(async (hash: any) => {
            await User.create({
                username,
                password: hash,
            })
                .then((user) =>
                    res.status(200).json({
                        message: "User successfully created",
                        user,
                    })
                )
                .catch((error) =>
                    res.status(400).json({
                        message: "User not successful created",
                        error: error.message,
                    })
                );
        });
    } catch (err: ErrorType) {
        res.status(401).json({
            message: "User not successful created",
            error: err.mesage,
        })
    }
}

export const login = async (req: RequestType, res: ResponseType,  next: any) => {
    const { username, password } = req.body
    // Check if username and password is provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password not present",
        })
    }
    try {
        const user = await User.findOne({ username })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {
            // comparing given password with hashed password
            bcrypt.compare(password, user.password).then(function (result: any) {
                result
                    ? res.status(200).json({
                        message: "Login successful",
                        user,
                    })
                    : res.status(400).json({ message: "Login not succesful" })
            })
        }
    } catch (error: ErrorType) {
        res.status(400).json({
            message: "An error occurred",
            error: error?.message,
        })
    }
}

export const update = async (req: RequestType, res: ResponseType,  next: any) => {
    const { role, id } = req.body
    if (role && id) {
        await User.findById(id)
            .then((user) => {
                if(!user) {
                    throw Error;
                }
                if (user?.role !== role) {
                    user.role = role;
                    user.save()
                        .then(() => {
                            res.status(201).json({message: "Update successful", user});
                        })
                        .catch((err) => {
                            res.status(400).json({message: "An error occurred", error: err.message});
                            process.exit(1);
                        });
                } else {
                    res.status(400).json({message: "User already has role: " + role});
                }
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({message: "An error occurred", error: error.message});
            });
    } else {
        res.status(400).json({message: "Role or Id not present"})
    }
}

export const deleteUser = async (req: RequestType, res: ResponseType,  next: any) => {
    const { id } = req.body
    await User.findById(id)
        .then(user =>   user?.deleteOne())
        .catch(error =>
            res
                .status(400)
                .json({ message: "An error occurred", error: error.message })
        )
        .then(user =>
            res.status(201).json({ message: "User successfully deleted", user })
        )
        .catch(error =>
            res
                .status(400)
                .json({ message: "An error occurred", error: error.message })
        )
}
