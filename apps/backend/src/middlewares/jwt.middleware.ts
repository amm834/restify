import {ExtractJwt, Strategy} from "passport-jwt";
import {findUserByEmail} from "../models/user.model";
import {config} from "../../config";


export const jwtStrategy = new Strategy({
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}, async function (payload, done) {
    try {
        const user = await findUserByEmail(payload.email)
        done(null, user)
    } catch (error) {
        done(error, false)
    }
})
