import {DocumentDefinition} from "mongoose";
import {User, UserDocument} from "../models/user.model";

export const createUser = async (user: DocumentDefinition<Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword">>) => {
    try {
        return await User.create(user);
    } catch (error) {
        throw new Error(error);
    }
}


export const findUserByEmail = async (email: string) => await User.findOne({email})
