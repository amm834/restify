import {Request, Response, NextFunction} from 'express';
import {
    CreateProductSchema,
    DeleteProductSchema,
    GetProductSchema,
    UpdateProductSchema
} from "../schemas/product.schema";
import {Product} from "../models/product.model";
import {createProduct, deleteProduct, findAndUpdateProduct, findProduct} from "../services/product.service";
import {IUser} from "../models/user.model";
import createHttpError from "http-errors";


export const createProductHandler = async (req: Request<{}, {}, CreateProductSchema["body"]>, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user['0']._id
        const {title, description, price, image} = req.body
        const product = await createProduct({title, description, price, image, user: userId});

        return res.status(201).json(product)
    } catch (e) {
        next(e)
    }
}

export const getProductById = async (req: Request<GetProductSchema["params"]>, res: Response, next: NextFunction) => {
    try {
        const {productId} = req.params

        const product = await findProduct({productId});

        if (!product) {
            throw createHttpError(404, 'Product not found')
        }

        return res.status(200).json(product)
    } catch (e) {
        next(e)
    }
}

export const updateProductById = async (req: Request<UpdateProductSchema["params"], {}, UpdateProductSchema["body"]>, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user['0']._id
        const {title, description, price, image} = req.body
        const {productId} = req.params

        const product = await findAndUpdateProduct({productId}, {
            title,
            description,
            price,
            image,
            user: userId
        }, {new: true});

        return res.status(200).json(product)
    } catch (e) {
        next(e)
    }

}

export const deleteProductById = async (req: Request<DeleteProductSchema["params"]>, res: Response, next: NextFunction) => {
    try {
        const {productId} = req.params
        const userId = res.locals.user['0']._id


        const product = await findProduct({productId});

        if (!product) {
            throw createHttpError(404, 'Product not found')
        }

        if (product.user.toString() !== userId.toString()) {
            throw createHttpError(401, 'Unauthorized')
        }

        await deleteProduct({productId})
        res.status(304).json({msg: 'Product deleted'})
    } catch (e) {
        next(e)
    }
}