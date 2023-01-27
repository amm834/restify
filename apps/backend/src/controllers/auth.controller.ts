import {NextFunction, Request, Response} from "express";
import {findUserByEmail, User} from "../models/user.model";
import createHttpError from "http-errors";
import {comparePassword} from "../utils/bcrypt.util";
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password} = req.body;
    try {
        const user = await User.create({name, email, password});
        await res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email}).select("+password");
        if (!user) {
            return next(createHttpError(401, "Invalid credentials"));
        }


        const isMatch = await comparePassword(password, user.password)

        if (!isMatch) {
            return next(createHttpError(401, "Invalid credentials"));
        }

        const access_token = jwt.sign({
            name: user.name,
            email: user.email,
        }, process.env.JWT_SECRET, {expiresIn: "1d"});

        return await res.status(200).json({
            msg: "Login Success",
            access_token
        });
    } catch (error) {
        next(error);
    }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body;

    try {
        const user = await findUserByEmail(email);
        await res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}