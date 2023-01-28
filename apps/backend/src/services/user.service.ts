import {DocumentDefinition, FilterQuery} from "mongoose";
import {IUser, User} from "../models/user.model";
import createHttpError from "http-errors";
import {comparePassword} from "../utils/bcrypt.util";
import consola from "consola";

export const createUser = async (user: DocumentDefinition<Omit<IUser, "createdAt" | "updatedAt">>) => {

    const result = await findUserByEmail(user.email);

    if (result) {
        throw createHttpError(409, "User already exists");
    }

    return await User.create(user);
}


export const findUserByEmail = async (email: string) => {
    return User.findOne({email}).select("+password").lean();
}

export const validatePassword = async (email: string, password: string): Promise<DocumentDefinition<IUser>> => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw createHttpError(401, "Invalid credentials");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        consola.error("Password is not a match");
        throw createHttpError(401, "Invalid credentials");
    }

    return user;
}


export const findUser = async (query: FilterQuery<IUser>) => {
    return User.find(query).lean(); // get javascript object instead of mongoose document
}