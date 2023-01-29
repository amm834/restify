import {Request, Response, NextFunction} from 'express';


export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user['0']._id
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {

}

export const updateProductById = async (req: Request, res: Response, next: NextFunction) => {

}

export const deleteProductById = async (req: Request, res: Response, next: NextFunction) => {

}