import { createContainer, asValue, asFunction } from 'awilix';

import app from './app';
import server from './interfaces/http/server';
import auth from './interfaces/http/auth';
import verify from './interfaces/http/middlewares/verify';
import config from '../config';
import jwt from './infra/jwt/jwt';
import redis from './infra/redis/caching';
import logger from './infra/logging/logger';
import repository from './infra/repositories';
import database from './infra/database';
import schema from './interfaces/schema-definition';
import response from './infra/support/response';

const container = createContainer();

container.register({
  app: asFunction(app).singleton(),
  auth: asFunction(auth).singleton(),
  config: asValue(config),
  database: asFunction(database).singleton(),
  jwt: asFunction(jwt).singleton(),
  logger: asFunction(logger).singleton(),
  redis: asFunction(redis).singleton(),
  repository: asFunction(repository).singleton(),
  response: asFunction(response).singleton(),
  schema: asFunction(schema).singleton(),
  server: asFunction(server).singleton(),
  verify: asFunction(verify).singleton(),
});

export default container;
