import {Session, SessionDocument} from "../models/session.model";
import {DocumentDefinition} from "mongoose";

export const createSession = async (userId: string, userAgent: string) => {
    return await Session.create <DocumentDefinition<Omit<SessionDocument, "createdAt" | "updatedAt" | "isValid">>>({
        user: userId,
        userAgent
    });
}