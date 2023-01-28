import {Router} from "express";
import {login, me, register} from "../controllers/user.controller";
import passport from "passport";
import {validate} from "../middlewares/validate.middleware";
import {createUserSchema} from "../schemas/user.schema";

export const userRouter: Router = Router();


userRouter
    .post('/register', validate(createUserSchema), register)
    .post('/login', login)
    .get('/me', passport.authenticate('jwt', {session: false}), me)
