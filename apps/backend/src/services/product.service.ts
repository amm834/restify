import {IProduct, Product} from "../models/product.model";
import {DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery} from "mongoose";
import {IUser, User} from "../models/user.model";

export const createProduct = async (product: DocumentDefinition<Omit<IProduct, "updatedAt" | "createdAt" | "uuid">>) => {
    return await Product.create(product)
}

export const findProduct = async (query: FilterQuery<IProduct>): Promise<IProduct> => {
    return Product.findOne(query).lean();
}


export const findAndUpdateProduct = async (
    query: FilterQuery<IProduct>,
    update: UpdateQuery<IProduct>,
    options: QueryOptions
) => Product.findOneAndUpdate(query, update, options);

export const deleteProduct = async (query: FilterQuery<IProduct>) => {
    await Product.deleteOne(query)
};