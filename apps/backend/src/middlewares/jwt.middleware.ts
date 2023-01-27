import {ExtractJwt, Strategy} from "passport-jwt";
import {findUserByEmail} from "../models/user.model";

export const jwtStrategy = new Strategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}, async function (payload, done) {
    try {
        const user = await findUserByEmail(payload.email)
        done(null, user)
    } catch (error) {
        done(error, false)
    }
})
