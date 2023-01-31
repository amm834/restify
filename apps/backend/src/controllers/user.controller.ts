import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import createHttpError from "http-errors";
import { comparePassword } from "../utils/bcrypt.util";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../services/user.service";
import { CreateUserSchema } from "../schemas/user.schema";
import { config } from "../config";
import lodash from "lodash";

export const register = async (
  req: Request<{}, {}, CreateUserSchema["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser(req.body);
    await res.status(201).json(lodash.omit(user.toJSON(), "password"));
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json(res.locals.user);
  } catch (error) {
    next(error);
  }
};
