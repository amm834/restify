import {z, object, string, TypeOf} from "zod";

export const createUserSchema = object({
    body: object({
        name: string({
            required_error: "Name is required",
        }),
        email: string({
            required_error: "Email is required",
        }).email("Email is invalid"),
        password: string({
            required_error: "Password is required",
        }).min(6, {
            message: "Password must be at least 6 characters",
        }),
        confirmPassword: string({
            required_error: "Confirm password is required",
        }).min(6, {
            message: "Confirm password must be at least 6 characters",
        }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password does not match",
        path: ["confirmPassword"],
    }),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
