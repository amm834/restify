import express, {Express, NextFunction, Request, Response} from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import {userRouter} from "./routes/user.routes";
import passport from "passport";
import {jwtStrategy} from "./middlewares/jwt.middleware";
import cors from "cors";
import createHttpError, {isHttpError} from "http-errors";
import {sessionRouter} from "./routes/session.routes";
import {deserializeUser} from "./middlewares/deserialize_user.middleware";


const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));

// jwt
passport.use(jwtStrategy);

app.use(deserializeUser);

// routes
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, "Not found"));
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const status = isHttpError(error) ? error.status : 500;

    const errorResponse = isHttpError(error) ? {msg: error.message,} : {msg: "Internal server error"};

    res.status(status).json(errorResponse);
})

export default app;