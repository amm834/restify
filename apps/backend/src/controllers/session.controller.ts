import {NextFunction, Request, Response} from "express";
import {createSession} from "../services/session.service";
import {validatePassword} from "../services/user.service";
import {signJwt} from "../utils/jwt.util";
import {config} from "../config";

export const createUserSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId, email, password} = req.body;

        const user = await validatePassword(email, password);

        const session = await createSession(userId, req.get("user-agent") ?? "");

        const {accessTokenTimeToLive, refreshTokenTimeToLive} = config

        const accessToken = signJwt({...user, session: session._id}, {expiresIn: accessTokenTimeToLive});

        const refreshToken = signJwt({user, session}, {expiresIn: refreshTokenTimeToLive});

        await res.status(201).json({accessToken, refreshToken});
    } catch (error) {
        next(error);
    }

}