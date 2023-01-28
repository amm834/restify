import mongoose from "mongoose";
import consola from "consola";
import {config} from "../config";


export const connectToMongoDatabase = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(config.mongoUrl);

        consola.info("Connected to MongoDB");
    } catch (error) {
        console.error(error)
        process.exit(1);
    }
}