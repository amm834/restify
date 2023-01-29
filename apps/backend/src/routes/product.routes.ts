import {Router} from "express";
import {createProduct, deleteProductById, getProductById, updateProductById} from "../controllers/products.controller";
import {requiredUser} from "../middlewares/required_user.middleware";

export const productRouter: Router = Router();

productRouter
    .post('/', requiredUser, createProduct)
    .get('/:productId', requiredUser, getProductById)
    .put('/:productId', requiredUser, updateProductById)
    .delete('/:productId', requiredUser, deleteProductById);