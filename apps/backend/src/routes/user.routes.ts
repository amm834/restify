import { Router } from "express";
import { getCurrentUser, register } from "../controllers/user.controller";
import { requiredUser } from "../middlewares/required_user.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createUserSchema } from "../schemas/user.schema";

export const userRouter: Router = Router();

userRouter
  .post("/register", validate(createUserSchema), register)
  .get("/me", requiredUser, getCurrentUser);
