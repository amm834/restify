import {object, string, TypeOf} from "zod";

export const sessionSchema = object({
    body: object({
        email: string({
            required_error: "Email is required",
        }).email("Email is invalid"),
        password: string({
            required_error: "Password is required",
        }).min(6, {
            message: "Password must be at least 6 characters",
        }),
    }),
});


export type SessionSchema = TypeOf<typeof sessionSchema>
