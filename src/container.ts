import type { AwilixContainer } from 'awilix';
import { createContainer, asValue, asClass, asFunction, Lifetime } from 'awilix';

import app from './app';
import server from './interfaces/http/server';
import auth from './interfaces/http/auth';
import verify from './interfaces/http/middlewares/verify';
import config from '../config';
import jwt from './infra/jwt/jwt';
import logger from './infra/logging/logger';
import repository from './infra/repositories';
import database from './infra/database';
import schema from './interfaces/schema-definition';
import response from './infra/support/response';
import Redis from './infra/cache';
import Locale from './locales';

import cache from './cache.config';
import i18n from './i18n.config';

const nameAndRegistration = {
  app: asFunction(app).singleton(),
  auth: asFunction(auth).singleton(),
  config: asValue(config),
  database: asFunction(database).singleton(),
  i18nProvider: asValue(i18n),
  jwt: asFunction(jwt).singleton(),
  locale: asClass(Locale, { lifetime: Lifetime.SINGLETON }),
  logger: asFunction(logger).singleton(),
  redisClient: asValue(cache),
  redis: asClass(Redis, { lifetime: Lifetime.SINGLETON }),
  repository: asFunction(repository).singleton(),
  response: asFunction(response).singleton(),
  schema: asFunction(schema).singleton(),
  server: asFunction(server).singleton(),
  verify: asFunction(verify).singleton(),
};

const container: AwilixContainer = createContainer();

container.register(nameAndRegistration);

export default container;
