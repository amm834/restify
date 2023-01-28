import {Router} from "express";
import {login, me, register} from "../controllers/user.controller";
import passport from "passport";

export const userRouter: Router = Router();


userRouter
    .post('/register', register)
    .post('/login', login)
    .get('/me', passport.authenticate('jwt', {session: false}), me)

