import {Router} from "express";
import {register} from "../controllers/user.controller";
import {validate} from "../middlewares/validate.middleware";
import {createUserSchema} from "../schemas/user.schema";

export const userRouter: Router = Router();


userRouter
    .post('/register', validate(createUserSchema), register)