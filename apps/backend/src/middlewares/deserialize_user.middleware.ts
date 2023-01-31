import { Request, Response, NextFunction } from "express";
import lodash from "lodash";
import { verifyJwt } from "../utils/jwt.util";
import { reIssueAccessToken } from "../services/session.service";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    (lodash.get(req, "cookies.accessToken") as string) ??
    lodash.get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken =
    (lodash.get(req, "cookies.refreshToken") as string) ??
    (lodash.get(req, "headers.x-refresh") as string);

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);

      res.cookie("accessToken", accessToken, {
        path: "/",
        httpOnly: true,
        maxAge: 900e3, // 15 minutes
        domain: "localhost",
        sameSite: "strict",
        secure: false,
      });
    }

    const result = verifyJwt(newAccessToken as string);

    res.locals.user = result.decoded;
    return next();
  }

  return next();
};
