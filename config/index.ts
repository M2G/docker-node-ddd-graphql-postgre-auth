import * as env from './env';
import * as database from './database';

const ENV = process.env.NODE_ENV || 'development';

function loadDbConfig () {
  return database.default[ENV];
}

function loadEnvConfig () {
  return env[ENV];
}

const envConfig = loadEnvConfig();
const dbConfig = loadDbConfig();

const config = Object.assign({
  env: ENV,
  db: dbConfig
}, envConfig)

export default config;
