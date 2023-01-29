import {ISession, Session} from "../models/session.model";
import {DocumentDefinition, FilterQuery, UpdateQuery} from "mongoose";
import {signJwt, verifyJwt} from "../utils/jwt.util";
import lodash from "lodash";
import {config} from "../config";
import {findUser} from "./user.service";

export const createSession = async (userId: string, userAgent: string) => {
    return await Session.create <DocumentDefinition<Omit<ISession, "createdAt" | "updatedAt" | "isValid">>>({
        user: userId,
        userAgent
    });
}

export const findSessions = async (query: FilterQuery<ISession>) => {
    return Session.find(query).lean();
}

export const updateSession = async (query: FilterQuery<ISession>, update: UpdateQuery<ISession>): Promise<ISession> => {
    return Session.updateOne(query, update).lean();
}

export async function reIssueAccessToken({
                                             refreshToken,
                                         }: {
    refreshToken: string;
}) {
    const {decoded} = verifyJwt(refreshToken, "refreshTokenPublicKey");

    if (!decoded || !lodash.get(decoded, "session")) return false;

    const session = await Session.findById(lodash.get(decoded, "session"));

    if (!session || !session.isValid) return false;

    const user = await findUser({_id: session.user});

    if (!user) return false;

    return signJwt(
        {...user, session: session._id},
        {expiresIn: config.accessTokenTimeToLive} // 15 minutes
    );
}

