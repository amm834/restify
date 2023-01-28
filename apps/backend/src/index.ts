import consola from "consola";
import app from "./app";
import {connectToMongoDatabase} from "./utils/connect.util";
import {config} from "./config";

try {
    const port = config.port;

    await connectToMongoDatabase();

    app.listen(port, () => {
        consola.info(`Server is running at http://localhost:${port}`);
    });
} catch (err) {
    consola.error(err.message);
    process.exit(1);
}
