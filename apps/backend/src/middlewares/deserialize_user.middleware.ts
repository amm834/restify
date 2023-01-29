import {Request, Response, NextFunction} from "express";
import lodash from "lodash";
import {verifyJwt} from "../utils/jwt.util";
import {reIssueAccessToken} from "../services/session.service";

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = lodash.get(req, "headers.authorization", "").replace(
        /^Bearer\s/,
        ""
    );

    const refreshToken = lodash.get(req, "headers.x-refresh") as string;

    if (!accessToken) {
        return next();
    }

    const {decoded, expired} = verifyJwt(accessToken);


    if (decoded) {
        res.locals.user = decoded;
        return next();
    }


    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({refreshToken});

        if (newAccessToken) {
            res.setHeader("x-access-token", newAccessToken);
        }

        const result = verifyJwt(newAccessToken as string);


        res.locals.user = result.decoded;
        return next();
    }

    return next();
};
