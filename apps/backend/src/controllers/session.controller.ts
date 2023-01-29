import {NextFunction, Request, Response} from "express";
import {createSession, findSessions, updateSession} from "../services/session.service";
import {findUserByEmail, validatePassword} from "../services/user.service";
import {signJwt} from "../utils/jwt.util";
import {config} from "../config";
import {SessionSchema} from "../schemas/session.schema";

export const createUserSession = async (req: Request<{}, {}, SessionSchema["body"]>, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body;

        const user = await validatePassword(email, password);

        const session = await createSession(user._id, req.get("user-agent") ?? "");

        const {accessTokenTimeToLive, refreshTokenTimeToLive} = config

        const accessToken = signJwt({...user, session: session._id}, {expiresIn: accessTokenTimeToLive});

        const refreshToken = signJwt({user, session}, {expiresIn: refreshTokenTimeToLive});

        await res.status(201).json({accessToken, refreshToken});
    } catch (error) {
        next(error);
    }
}

export const getUserSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user._id;
        const sessions = await findSessions({user: userId, valid: true});
        return res.send(sessions);
    } catch (error) {
        next(error);
    }
}


export async function deleteSessionHandler(req: Request, res: Response) {
    const sessionId = res.locals.user.session;

    await updateSession({_id: sessionId}, {valid: false});

    return res.send({
        accessToken: null,
        refreshToken: null,
    });
}