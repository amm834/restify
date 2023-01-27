import {z} from "zod";

export const userSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }),
    email: z.string({
        required_error: "Email is required",
    }).email("Email is invalid"),
    password: z.string({
        required_error: "Password is required",
    }).min(6, {
        message: "Password must be at least 6 characters",
    }),
})

export const userRequestSchema = z.object({
    body: userSchema,
})

export const userLoginRequestSchema = z.object({
    body: userSchema.pick({
        email: true,
        password: true,
    }),
})

export type UserSchema = z.infer<typeof userSchema>
export type UserRequestSchema = z.infer<typeof userRequestSchema>
export type UserLoginRequestSchema = z.infer<typeof userLoginRequestSchema>