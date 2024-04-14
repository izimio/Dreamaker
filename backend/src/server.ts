import app from "./app";
import { logger } from "./utils/logger";
import { PORT } from "./utils/config";
import dotenv from "dotenv";
import moogoose from "mongoose";
dotenv.config();

const log = logger.extend("server");

moogoose.connection.on("connected", () => {
    app.listen(PORT, () => log(`Server listening on ${PORT}`));
});
