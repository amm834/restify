import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { userRouter } from "./routes/user.routes";
import cors from "cors";
import createHttpError, { isHttpError } from "http-errors";
import { sessionRouter } from "./routes/session.routes";
import { deserializeUser } from "./middlewares/deserialize_user.middleware";
import { productRouter } from "./routes/product.routes";
import { config } from "./config";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(
  cors({
    origin: config.origin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(deserializeUser);

// routes
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/products", productRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404, "Not found"));
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const status = isHttpError(error) ? error.status : 500;

  const errorResponse = isHttpError(error)
    ? { msg: error.message }
    : { msg: "Internal server error" };

  res.status(status).json(errorResponse);
});

export default app;
