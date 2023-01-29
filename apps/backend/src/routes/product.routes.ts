import {Router} from "express";
import {
    createProductHandler,
    deleteProductById,
    getProductById,
    updateProductById
} from "../controllers/products.controller";
import {requiredUser} from "../middlewares/required_user.middleware";
import {validate} from "../middlewares/validate.middleware";
import {
    createProductSchema,
    deleteProductSchema,
    getProductSchema,
    updateProductSchema
} from "../schemas/product.schema";

export const productRouter: Router = Router();

productRouter
    .post('/', [requiredUser, validate(createProductSchema)], createProductHandler)
    .get('/:productId', [validate(getProductSchema)], getProductById)
    .put('/:productId', [requiredUser, validate(updateProductSchema)], updateProductById)
    .delete('/:productId', [requiredUser, validate(deleteProductSchema)], deleteProductById);