import {NextFunction, Request, Response} from "express";
import {User} from "../models/user.model";
import createHttpError from "http-errors";
import {comparePassword} from "../utils/bcrypt.util";
import jwt from "jsonwebtoken";
import {createUser, findUserByEmail} from "../services/user.service";
import {CreateUserSchema} from "../schemas/user.schema";
import {config} from "../config";

export const register = async (
    req: Request<{}, {}, CreateUserSchema["body"]>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await createUser(req.body);
        await res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email}).select("+password");
        if (!user) {
            return next(createHttpError(401, "Invalid credentials"));
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return next(createHttpError(401, "Invalid credentials"));
        }

        const access_token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            },
            config.jwtSecret,
            {expiresIn: config.jwtExpiration}
        );

        return await res.status(200).json({
            msg: "Login Success",
            access_token,
        });
    } catch (error) {
        next(error);
    }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body;

    try {
        const user = await findUserByEmail(email);
        await res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};
