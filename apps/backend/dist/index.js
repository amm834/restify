// src/index.ts
import consola3 from "consola";

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
var userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, email: true },
  password: { type: String, required: true, minlength: 6, select: false }
}, {
  timestamps: true
});
userSchema.pre("save", async function(next) {
  const user2 = this;
  if (!user2.isModified("password"))
    return next();
  try {
    user2.password = await hashPassword(user2.password);
    return next();
  } catch (error) {
    return next(error);
  }
});
var User = model("User", userSchema);
var user = User.find({ email: "amm@gmail.com" });

// src/services/user.service.ts
import createHttpError from "http-errors";
import consola from "consola";
var createUser = async (user2) => {
  const result = await findUserByEmail(user2.email);
  if (result) {
    throw createHttpError(409, "User already exists");
  }
  return await User.create(user2);
};
var findUserByEmail = async (email) => {
  return User.findOne({ email }).select("+password").lean();
};
var validatePassword = async (email, password) => {
  const user2 = await findUserByEmail(email);
  if (!user2) {
    throw createHttpError(401, "Invalid credentials");
  }
  const isMatch = await comparePassword(password, user2.password);
  if (!isMatch) {
    consola.error("Password is not a match");
    throw createHttpError(401, "Invalid credentials");
  }
  return user2;
};
var findUser = async (query) => {
  return User.find(query).lean();
};

// src/controllers/user.controller.ts
import lodash from "lodash";
var register = async (req, res, next) => {
  try {
    const user2 = await createUser(req.body);
    await res.status(201).json(lodash.omit(user2.toJSON(), "password"));
  } catch (error) {
    next(error);
  }
};

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
    passwordConfirmation: string({
      required_error: "Confirm password is required"
    }).min(6, {
      message: "Confirm password must be at least 6 characters"
    })
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password does not match",
    path: ["passwordConfirmation"]
  })
});

// src/routes/user.routes.ts
var userRouter = Router();
userRouter.post("/register", validate(createUserSchema), register);

// src/app.ts
import cors from "cors";
import createHttpError2, { isHttpError } from "http-errors";

// src/routes/session.routes.ts
import { Router as Router2 } from "express";

// src/schemas/session.schema.ts
import { object as object2, string as string2 } from "zod";
var sessionSchema = object2({
  body: object2({
    email: string2({
      required_error: "Email is required"
    }).email("Email is invalid"),
    password: string2({
      required_error: "Password is required"
    }).min(6, {
      message: "Password must be at least 6 characters"
    })
  })
});

// src/models/session.model.ts
import { model as model2, Schema as Schema2 } from "mongoose";
var sessionModelSchema = new Schema2({
  user: {
    type: Schema2.Types.ObjectId,
    ref: "User"
  },
  isValid: {
    type: Boolean,
    default: true
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});
var Session = model2("Session", sessionModelSchema);

// src/config/index.ts
var config = {
  port: 8e3,
  mongoUrl: "mongodb://localhost:27017/turbo-rest-api",
  saltRounds: 10,
  jwtExpiration: "1d",
  jwtSecret: "secret",
  accessTokenTimeToLive: "15m",
  refreshTokenTimeToLive: "7d",
  publicKey: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsvOiUE9bh1cdKw7o3sbD
g3Q/LuUxi/ONMMZJARwcG9xUKtx1Q+ld0oXJ+UXcMy1r2xU+D2UIT9r8Mt84fUjO
CxLx3DzkD6p+jyh/3VORGlqF4xK5D/jpePKrZHi+a2eBxyLD9zx5J8BhT1Mtwpm8
bzQvRHJI3ecf53RwjpowfBRMcHn5XeHZOhVoTmEWmFK8AoRH4EP5dBXGsjHnO++6
IrmIDeaL4xJk4XGIn13ee1yX9JXtifPTgDyOKk5fXnr/UOZg2g71RFkiIQRiQ4Np
xK3SKPPL4goYB6hoE2DlsZ7TNu0ZoThnUS4dwuG60nyEpbif+xQyGP+yQKIT9DSk
bAy49lCwCEiMcC+pw9TtXy3u3xUtQ6+HCglf79wusXmUpBEjuQbxv84cVdza7p3B
FL+Gjo2SSBu7oMI9NUn5SLGQD/duuALCQTYwrG14/HMLYC7/mi1w/GerzPuN+Y8Q
BDmLAJRMpD9QC3q+frzY5BkiFCGGKsLa6mCUx5NXlKpUUQsyiV7S22txuyy25/63
AmvcPaE+U9Xt3Ot7Ot4viAVTqb3UUsH9Ts+Anb6UCZd5A4eMEJGxFgxONxgtQRvy
j2j5+MdgWHGVc1gJ1fejv7GYVO9HL7SGkflDUd7fHIa3tRpwX2beuSQyLl2BJySc
fdw5MQDnE7Z77RUBnRhUsHMCAwEAAQ==
-----END PUBLIC KEY-----`,
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
`
};

// src/utils/jwt.util.ts
import jwt from "jsonwebtoken";
var publicKey = config.publicKey;
var privateKey = config.privateKey;
var signJwt = (payload, options) => {
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    ...options && options
  });
};
var verifyJwt = (token) => {
  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"]
    });
    return {
      decoded,
      valid: true,
      expired: false
    };
  } catch (error) {
    return {
      valid: false,
      decoded: null,
      expired: error.message === "jwt expired"
    };
  }
};

// src/services/session.service.ts
import lodash2 from "lodash";
var createSession = async (userId, userAgent) => {
  return await Session.create({
    user: userId,
    userAgent
  });
};
var findSessions = async (query) => {
  return Session.find(query).lean();
};
var updateSession = async (query, update) => {
  return Session.updateOne(query, update).lean();
};
async function reIssueAccessToken({
  refreshToken
}) {
  const { decoded } = verifyJwt(refreshToken);
  if (!decoded || !lodash2.get(decoded, "session"))
    return false;
  const session = await Session.findById(lodash2.get(decoded, "session"));
  if (!session || !session.isValid)
    return false;
  const user2 = await findUser({ _id: session.user });
  if (!user2)
    return false;
  return signJwt(
    { ...user2, session: session._id },
    { expiresIn: config.accessTokenTimeToLive }
  );
}

// src/controllers/session.controller.ts
var createUserSession = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user2 = await validatePassword(email, password);
    const session = await createSession(user2._id, req.get("user-agent") ?? "");
    const { accessTokenTimeToLive, refreshTokenTimeToLive } = config;
    const accessToken = signJwt({ ...user2, session: session._id }, { expiresIn: accessTokenTimeToLive });
    const refreshToken = signJwt({ user: user2, session }, { expiresIn: refreshTokenTimeToLive });
    await res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};
var getUserSessions = async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    const sessions = await findSessions({ user: userId, valid: true });
    return res.send(sessions);
  } catch (error) {
    next(error);
  }
};
async function deleteSessionHandler(req, res) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({
    accessToken: null,
    refreshToken: null
  });
}

// src/middlewares/required_user.middleware.ts
var requiredUser = (req, res, next) => {
  const user2 = res.locals.user;
  if (!user2) {
    return res.sendStatus(403);
  }
  return next();
};

// src/routes/session.routes.ts
var sessionRouter = Router2();
sessionRouter.post("/", validate(sessionSchema), createUserSession).get("/", requiredUser, getUserSessions).delete("/sessions", requiredUser, deleteSessionHandler);

// src/middlewares/deserialize_user.middleware.ts
import lodash3 from "lodash";
var deserializeUser = async (req, res, next) => {
  const accessToken = lodash3.get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );
  const refreshToken = lodash3.get(req, "headers.x-refresh");
  if (!accessToken) {
    return next();
  }
  const { decoded, expired } = verifyJwt(accessToken);
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }
    const result = verifyJwt(newAccessToken);
    res.locals.user = result.decoded;
    return next();
  }
  return next();
};

// src/routes/product.routes.ts
import { Router as Router3 } from "express";

// src/controllers/products.controller.ts
var createProduct = async (req, res, next) => {
  const userId = res.locals.user["0"]._id;
};
var getProductById = async (req, res, next) => {
};
var updateProductById = async (req, res, next) => {
};
var deleteProductById = async (req, res, next) => {
};

// src/routes/product.routes.ts
var productRouter = Router3();
productRouter.post("/", requiredUser, createProduct).get("/:productId", requiredUser, getProductById).put("/:productId", requiredUser, updateProductById).delete("/:productId", requiredUser, deleteProductById);

// src/app.ts
var app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(deserializeUser);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/products", productRouter);
app.use((req, res, next) => {
  next(createHttpError2(404, "Not found"));
});
app.use((error, req, res, next) => {
  const status = isHttpError(error) ? error.status : 500;
  const errorResponse = isHttpError(error) ? { msg: error.message } : { msg: "Internal server error" };
  res.status(status).json(errorResponse);
});
var app_default = app;

// src/utils/connect.util.ts
import mongoose from "mongoose";
import consola2 from "consola";
var connectToMongoDatabase = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(config.mongoUrl);
    consola2.info("Connected to MongoDB");
  } catch (error) {
    consola2.error("Failed to connect to MongoDB");
    consola2.error(error);
    process.exit(1);
  }
};

// src/index.ts
try {
  const port = config.port;
  await connectToMongoDatabase();
  app_default.listen(port, () => {
    consola3.info(`Server is running at http://localhost:${port}`);
  });
} catch (err) {
  consola3.error(err.message);
  process.exit(1);
}
