import {config} from "../config";
import jwt from 'jsonwebtoken'

const publicKey = config.publicKey
const privateKey = config.privateKey

export const signJwt = (payload: Object, options?: jwt.SignOptions) => {
    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        ...(options && options),
    })
}

export const verifyJwt = (token: string, options: any) => {
    try {
        const decoded = jwt.verify(token, publicKey, options)
        return {
            decoded,
            valid: true,
            expired: false,
        }
    } catch (error: any) {
        return {
            valid: false,
            decoded: null,
            expired: error.message === 'jwt expired',
        }
    }
}