import express, {Express, NextFunction, Request, Response} from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import createHttpError, {isHttpError} from "http-errors";
import {userRouter} from "./routes/user.routes";
import passport from "passport";
import {jwtStrategy} from "./middlewares/jwt.middleware";
import cors from "cors";


const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));

// jwt
passport.use(jwtStrategy);

// routes
app.use("/api/user", userRouter);


app.use((req, res, next) => {
    next(createHttpError.NotFound("This endpoint does not exist"));
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const status = isHttpError(error) ? error.status : 500;

    res.status(status).json({
        status,
        msg: error.message,
        error,
    });
})


export default app;