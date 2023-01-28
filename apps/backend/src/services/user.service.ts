import {DocumentDefinition} from "mongoose";
import {User, UserDocument} from "../models/user.model";

export const createUser = async (user: DocumentDefinition<Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword">>) => {
    return await User.create(user);
}


export const findUserByEmail = async (email: string) => await User.findOne({email})
