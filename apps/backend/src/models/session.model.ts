import {Document, model, Schema} from "mongoose";
import {comparePassword, hashPassword} from "../utils/bcrypt.util";
import {IUser} from "./user.model";

export interface SessionDocument extends Document {
    user: IUser['_id'];
    isValid: boolean;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}

const sessionModelSchema = new Schema<SessionDocument>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    isValid: {
        type: Boolean,
        default: true,
    },
    userAgent: {
        type: String,
    }
}, {
    timestamps: true,
});


export const Session = model("Session", sessionModelSchema);

