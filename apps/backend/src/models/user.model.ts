import {Document, Model, model, Schema} from "mongoose";
import {comparePassword, hashPassword} from "../utils/bcrypt.util";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}


const userSchema = new Schema<IUser>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, email: true},
    password: {type: String, required: true, minlength: 6, select: false},
}, {
    timestamps: true,
});

//  hash password before saving to database
userSchema.pre("save", async function (next) {
    const user = this as IUser;

    if (!user.isModified("password")) return next();

    try {
        user.password = await hashPassword(user.password)
        return next()
    } catch (error: any) {
        return next(error)
    }
});


export const User = model<IUser>("User", userSchema);

const user = User.find({email: "amm@gmail.com"})

