import {object, string, TypeOf} from "zod";

export const sessionSchema = object({
    email: string({
        required_error: "Email is required",
    })
        .email("Invalid email address"),
    password: string({
        required_error: "Password is required",
    }),
})

export type SessionSchema = TypeOf<typeof sessionSchema>
