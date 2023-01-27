import {z} from 'zod'
import {Schema} from "mongoose";

export const noteSchema = z.object({
    title: z.string({
        required_error: "Title is required"
    }),
    body: z.string({
        required_error: "Body is required"
    }),
    user_id: z.string({
        required_error: "User id is required"
    }),
})

export const notePartialSchema = noteSchema.partial()

export const noteRequestSchema = z.object({
    body: noteSchema,
})


export type NoteSchema = z.infer<typeof noteSchema>
export type NoteRequestSchema = z.infer<typeof noteRequestSchema>