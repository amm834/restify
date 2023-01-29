import {number, object, string, TypeOf} from "zod";

const payload = {
    body: object({
        title: string({
            required_error: "Title is required"
        }),
        description: string({
            required_error: "Description is required"
        }).min(120, {
            message: "Description must be at least 120 characters"
        })
        ,
        price: number({
            required_error: "Price is required"
        }),
        image: string({
            required_error: "Image is required"
        }),
    }),
};


const params = {
    params: object({
        productId: string({
            required_error: "Product id is required"
        })
    }),
};

export const createProductSchema = object({
    ...payload,
});


export const updateProductSchema = object({
    ...params,
    ...payload,
});

export const deleteProductSchema = object({
    ...params,
});


export const getProductSchema = object({
    ...params,
});

export type CreateProductSchema = TypeOf<typeof createProductSchema>;
export type UpdateProductSchema = TypeOf<typeof updateProductSchema>;
export type DeleteProductSchema = TypeOf<typeof deleteProductSchema>;
export type GetProductSchema = TypeOf<typeof getProductSchema>;
