import app from './app';
import { logger } from './utils/logger';
import { PORT } from './utils/config';
import dotenv from 'dotenv';

const log = logger.extend('server');

dotenv.config();
app.listen(PORT, () => log(`Server listening on ${PORT}`));
