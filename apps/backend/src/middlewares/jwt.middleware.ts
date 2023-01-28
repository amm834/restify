import {ExtractJwt, Strategy} from "passport-jwt";
import {config} from "../config";
import {findUserByEmail} from "../services/user.service";

const opts = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}
export const jwtStrategy = new Strategy(opts, async function (payload, done) {
    try {
        const user = await findUserByEmail(payload.email)
        done(null, user)
    } catch (error) {
        done(error, false)
    }
})
