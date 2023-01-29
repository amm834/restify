import {IUser} from "./user.model";
import {model, Schema} from "mongoose";
import {v4 as uuidv4} from 'uuid';

export interface IProduct extends Document {
    uuid: string;
    title: string;
    description: string;
    price: number;
    image: string;
    user: IUser;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    uuid: {type: String, default: uuidv4()},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
}, {
    timestamps: true,
});

export const Product = model<IProduct>("Product", productSchema);
