
// ==================== APP ==================== //

export const PORT = process.env.PORT as string;
if (!PORT) {
  throw new Error('Missing APP_PORT');
}

export const APP_NAME = process.env.ALLOWED_ORIGINS as string;
if (!APP_NAME) {
  throw new Error('Missing APP_NAME');
}

export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS as string;
if (!ALLOWED_ORIGINS) {
  throw new Error('Missing ALLOWED_ORIGINS');
}

// ==================== MONGO ==================== //

export const MONGO_HOST = process.env.MONGO_HOST as string;
if (!MONGO_HOST) {
  throw new Error('Missing MONGO_HOST');
}

export const MONGO_PORT = process.env.MONGO_PORT as string;
if (!MONGO_PORT) {
  throw new Error('Missing MONGO_PORT');
}

export const MONGO_INITDB_DATABASE = process.env
  .MONGO_INITDB_DATABASE as string;
if (!MONGO_INITDB_DATABASE) {
  throw new Error('Missing MONGO_INITDB_DATABASE');
}

export const MONGO_INITDB_ROOT_USERNAME = process.env
  .MONGO_INITDB_ROOT_USERNAME as string;
if (!MONGO_INITDB_ROOT_USERNAME) {
  throw new Error('Missing MONGO_INITDB_ROOT_USERNAME');
}

export const MONGO_INITDB_ROOT_PASSWORD = process.env
  .MONGO_INITDB_ROOT_PASSWORD as string;
if (!MONGO_INITDB_ROOT_PASSWORD) {
  throw new Error('Missing MONGO_INITDB_ROOT_PASSWORD');
}

// ==================== JWT ==================== //

export const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET');
}

// ==================== RATE-LIMIT ==================== //

export const APP_WHITELIST = process.env.APP_WHITELIST as string;
export const APP_BLACKLIST = process.env.APP_BLACKLIST as string;

export const APP_MAX_REQUESTS = process.env.APP_MAX_REQUESTS as string;
if (!APP_MAX_REQUESTS) {
  throw new Error('Missing APP_MAX_REQUESTS');
}

export const APP_WINDOW_SECONDS = process.env.APP_WINDOW_SECONDS as string;
if (!APP_WINDOW_SECONDS) {
  throw new Error('Missing APP_WINDOW_SECONDS');
}


// ==================== ETHEREUM ==================== //

export const BLOCKCHAIN_RPC = process.env.BLOCKCHAIN_RPC as string;
if (!BLOCKCHAIN_RPC) {
  throw new Error('Missing BLOCKCHAIN_RPC');
}

export const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY as string;
if (!DEPLOYER_PRIVATE_KEY) {
  throw new Error('Missing DEPLOYER_PRIVATE_KEY');
}

export const BASE_MINING_DREAMAKER = process.env.BASE_MINING_DREAMAKER as string;
if (!BASE_MINING_DREAMAKER) {
  throw new Error('Missing BASE_MINING_DREAMAKER');
}
// ==================== BLOCKCHAIN ==================== //

export const DREAM_SINGLETON_ADDRESS = process.env
  .DREAM_SINGLETON_ADDRESS as string;
if (!DREAM_SINGLETON_ADDRESS) {
  throw new Error('Missing DREAM_SINGLETON_ADDRESS');
}

export const DREAM_PROXY_FACTORY_ADDRESS = process.env
  .DREAM_PROXY_FACTORY_ADDRESS as string;
if (!DREAM_PROXY_FACTORY_ADDRESS) {
  throw new Error('Missing DREAM_PROXY_FACTORY_ADDRESS');
}

export const DREAMAKER_ADDRESS = process.env.DREAMAKER_ADDRESS as string;
if (!DREAMAKER_ADDRESS) {
  throw new Error('Missing DREAMAKER_ADDRESS');
}

// ==================== FIREBASE ==================== //

export const BUCKET_URL = process.env.BUCKET_URL as string;
if (!BUCKET_URL) {
  throw new Error('Missing BUCKET_URL');
}