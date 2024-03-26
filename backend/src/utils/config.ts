export const PORT = process.env.PORT as string;
if (!PORT) {
    throw new Error("Missing APP_PORT");
}

export const APP_NAME = process.env.ALLOWED_ORIGINS as string;
if (!APP_NAME) {
    throw new Error("Missing APP_NAME");
}

// CORS
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS as string;
if (!ALLOWED_ORIGINS) {
    throw new Error("Missing ALLOWED_ORIGINS");
}

// MONGO
export const MONGO_HOST = process.env.MONGO_HOST as string;
if (!MONGO_HOST) {
    throw new Error("Missing MONGO_HOST");
}
export const MONGO_PORT = process.env.MONGO_PORT as string;
if (!MONGO_PORT) {
    throw new Error("Missing MONGO_PORT");
}
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME as string;
if (!MONGO_DB_NAME) {
    throw new Error("Missing MONGO_DB_NAME");
}

export const MONGO_USERNAME = process.env.MONGO_USERNAME as string;
if (!MONGO_USERNAME) {
    throw new Error("Missing MONGO_USERNAME");
}
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD as string;
if (!MONGO_PASSWORD) {
    throw new Error("Missing MONGO_PASSWORD");
}

export const APP_WHITELIST = process.env.APP_WHITELIST as string
export const APP_BLACKLIST = process.env.APP_BLACKLIST as string

export const APP_MAX_REQUESTS = process.env.APP_MAX_REQUESTS as string;
if (!APP_MAX_REQUESTS) {
    throw new Error("Missing APP_MAX_REQUESTS");
}

export const APP_WINDOW_SECONDS = process.env.APP_WINDOW_SECONDS as string;
if (!APP_WINDOW_SECONDS) {
    throw new Error("Missing APP_WINDOW_SECONDS");
}