import {Router} from "express";
import {validate} from "../middlewares/validate.middleware";
import {sessionSchema} from "../schemas/session.schema";
import {createUserSession, deleteSessionHandler, getUserSessions} from "../controllers/session.controller";
import {requiredUser} from "../middlewares/required_user.middleware";

export const sessionRouter: Router = Router();

sessionRouter
    .post("/", validate(sessionSchema), createUserSession)
    .get("/", requiredUser, getUserSessions)
    .delete("/sessions", requiredUser, deleteSessionHandler)
