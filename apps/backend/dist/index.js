// src/index.ts
import consola2 from "consola";

// src/app.ts
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";

// src/routes/user.routes.ts
import { Router } from "express";

// src/models/user.model.ts
import { model, Schema } from "mongoose";

// src/utils/bcrypt.util.ts
import bcrypt from "bcrypt";
var hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
var comparePassword = async (password, hash) => {
  return !!await bcrypt.compare(password, hash);
};

// src/models/user.model.ts
var userModelSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, email: true },
  password: { type: String, required: true, minlength: 6, select: false }
}, {
  timestamps: true
});
userModelSchema.pre("save", async function(next) {
  const user = this;
  if (!user.isModified("password"))
    return next();
  try {
    user.password = await hashPassword(user.password);
    return next();
  } catch (error) {
    return next(error);
  }
});
userModelSchema.methods.comparePassword = async function(password) {
  const user = this;
  return await comparePassword(password, user.password);
};
var User = model("User", userModelSchema);

// src/controllers/user.controller.ts
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

// src/services/user.service.ts
var createUser = async (user) => {
  return await User.create(user);
};
var findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// src/config/index.ts
var config = {
  port: 8e3,
  mongoUrl: "mongodb://localhost:27017/turbo-rest-api",
  jwtSecret: "secret",
  jwtExpiration: "1d",
  saltRounds: 10
};

// src/controllers/user.controller.ts
var register = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    await res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
var login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(createHttpError(401, "Invalid credentials"));
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return next(createHttpError(401, "Invalid credentials"));
    }
    const access_token = jwt.sign(
      {
        name: user.name,
        email: user.email
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );
    return await res.status(200).json({
      msg: "Login Success",
      access_token
    });
  } catch (error) {
    next(error);
  }
};
var me = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    await res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// src/routes/user.routes.ts
import passport from "passport";

// src/middlewares/validate.middleware.ts
var validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params
    });
    return next();
  } catch (error) {
    return res.status(422).json(error);
  }
};

// src/schemas/user.schema.ts
import { object, string } from "zod";
var createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required"
    }),
    email: string({
      required_error: "Email is required"
    }).email("Email is invalid"),
    password: string({
      required_error: "Password is required"
    }).min(6, {
      message: "Password must be at least 6 characters"
    }),
    confirmPassword: string({
      required_error: "Confirm password is required"
    }).min(6, {
      message: "Confirm password must be at least 6 characters"
    })
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"]
  })
});

// src/routes/user.routes.ts
var userRouter = Router();
userRouter.post("/register", validate(createUserSchema), register).post("/login", login).get("/me", passport.authenticate("jwt", { session: false }), me);

// src/app.ts
import passport2 from "passport";

// src/middlewares/jwt.middleware.ts
import { ExtractJwt, Strategy } from "passport-jwt";
var opts = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
var jwtStrategy = new Strategy(opts, async function(payload, done) {
  try {
    const user = await findUserByEmail(payload.email);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

// src/app.ts
import cors from "cors";
import createHttpError2, { HttpError } from "http-errors";
var app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
passport2.use(jwtStrategy);
app.use("/api/users", userRouter);
app.use((req, res, next) => {
  next(createHttpError2(404, "Not found"));
});
app.use((error, req, res, next) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ msg: error.message });
  }
  return res.status(500).json({ msg: "Something went wrong", error });
});
var app_default = app;

// src/utils/connect.util.ts
import mongoose from "mongoose";
import consola from "consola";
var connectToMongoDatabase = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(config.mongoUrl);
    consola.info("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// src/index.ts
try {
  const port = config.port;
  await connectToMongoDatabase();
  app_default.listen(port, () => {
    consola2.info(`Server is running at http://localhost:${port}`);
  });
} catch (err) {
  consola2.error(err.message);
  process.exit(1);
}
