import {model, Schema} from "mongoose";
import {NoteSchema} from "../schemas";


const NoteModelSchema = new Schema<NoteSchema>({
    title: {type: String, required: true,},
    body: {type: String, required: true,},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true,},
});


export const Note = model<NoteSchema>("Note", NoteModelSchema);

