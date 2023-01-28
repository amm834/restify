import {Document, model, Schema} from "mongoose";
import {comparePassword, hashPassword} from "../utils/bcrypt.util";

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
}

const userModelSchema = new Schema<UserDocument>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, email: true},
    password: {type: String, required: true, minlength: 6, select: false},
}, {
    timestamps: true,
});

userModelSchema.pre("save", async function (next) {
    const user = this as UserDocument;

    if (!user.isModified("password")) return next();

    try {
        user.password = await hashPassword(user.password)
        return next()
    } catch (error) {
        return next(error)
    }
});

userModelSchema.methods.comparePassword = async function (password: string) {
    const user = this as UserDocument;
    return await comparePassword(password, user.password);
}

export const User = model("User", userModelSchema);

