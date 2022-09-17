/*eslint-disable*/
import {
  ConnectOptions,
  connect,
  connection,
  Schema,
  model,
  // Model,
} from 'mongoose';
import path from 'path';
import fs from 'fs';

export default ({ config, basePath, logger }: any) => {
  const { env } = config;

  if (env !== 'test') {
    const configDb = { ...config.db };

    connect(
      `mongodb://${configDb.user}:${configDb.password}@db:${configDb.host}/${configDb.database}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        minPoolSize: 1,
        maxPoolSize: 20,
        socketTimeoutMS: 60000,
        serverSelectionTimeoutMS: 60000,
        loggerLevel: 'error',
      } as ConnectOptions,
    );

    connection.on('connecting', () => logger.info('database connecting'));
    connection.on('connected', () => logger.info('database connected'));
    connection.on('disconnecting', () => logger.info('database disconnecting'));
    connection.on('disconnected', () => logger.info('database disconnected'));
    connection.on('error', () => logger.error('database error'));
  }

  const db = {
    models: {},
  };

  const dir = path.join(basePath, './schemas');

  for (const files of fs
    .readdirSync(dir)
    ?.filter(
      (file) => file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js',
    )) {
    const modelDir = path.join(dir, files);
    const requireModel: any = require(modelDir);
    const fileName = path.parse(files).name;
    const models = requireModel.default;

    db.models[fileName] = models({
      Schema,
      model,
    });
  }

  return db;
};
