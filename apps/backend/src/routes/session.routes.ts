import {Router} from "express";
import {validate} from "../middlewares/validate.middleware";
import {sessionSchema} from "../schemas/session.schema";
import {createUserSession} from "../controllers/session.controller";

export const sessionRouter: Router = Router();

sessionRouter
    .post("/", validate(sessionSchema), createUserSession)