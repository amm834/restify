export const config = {
    port: 8000,
    mongoUrl: 'mongodb://localhost:27017/turbo-rest-api',
    jwtSecret: 'secret',
    jwtExpiration: '1d',
    saltRounds: 10,
}