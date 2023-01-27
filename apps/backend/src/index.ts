import "dotenv/config";
import consola from "consola";
import mongoose from "mongoose";
import app from "./app";

try {
    const port = process.env.PORT || 8000;

    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URL);

    consola.info("[Server] Connected to MongoDB");

    app.listen(port, () => {
        consola.info(`[Server] Server is running at http://localhost:${port}`);
    });
} catch (err) {
    consola.error(err.message);
}
