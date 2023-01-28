import express, {Express, NextFunction, Request, Response} from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import {userRouter} from "./routes/user.routes";
import passport from "passport";
import {jwtStrategy} from "./middlewares/jwt.middleware";
import cors from "cors";
import createHttpError, {HttpError} from "http-errors";


const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));

// jwt
passport.use(jwtStrategy);

// routes
app.use("/api/users", userRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, "Not found"));
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof HttpError) {
        return res.status(error.status).json({msg: error.message});
    }
    return res.status(500).json({msg: "Something went wrong", error});
});


export default app;