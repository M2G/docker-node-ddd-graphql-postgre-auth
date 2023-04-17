import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';

const { DB_FORCE_RESTART } = process.env;

export default ({ config, basePath }: any) => {
  console.log(':::::::', config);
  const sequelize = new Sequelize(
    process.env.POSTGRES_DB ?? '',
    process.env.DB_USER ?? '',
    process.env.DB_PASSWORD ?? '',
    { ...config.db },
  );

  /*
   const sequelize = new Sequelize(
   'test_db2',
   'postgres',
   'postgres',
    {
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
      logging: process.env.ENV === 'production' ? false : console.log,
    });
   */

  const db = {
    models: {},
    sequelize,
    Sequelize,
  };

  const sequelizeOptions: {
    logging: Function;
    force: boolean | undefined;
  } = {
    force: undefined,
    logging: console.log,
  };

  const dir = path.join(basePath as string, './models');

  fs.readdirSync(dir)
    ?.filter(
      (file) =>
        !file.startsWith('.')
        && file !== 'index.js'
        && file.endsWith('.js'),
    )
    ?.forEach((file) => {
      const modelDir = path.join(dir, file);

      /*
       * @see https://github.com/sequelize/express-example/issues/99
       * Sequelize v5 -> v6
       * const model = sequelize.import(modelDir);
       */
      const model = require(modelDir)(sequelize, DataTypes);

      db.models[model.name] = model;
    });

  db.models
  && Object.keys(db.models)?.forEach((key) => {
    if ('associate' in db.models[key]) {
      db.models[key].associate(db.models);
    }
  });

  // Removes all tables and recreates them (only available if env is not in production)
  if (
    DB_FORCE_RESTART === 'true'
    && process.env.ENV !== 'production'
  ) {
    sequelizeOptions.force = true;
  }

  sequelize
    .sync(sequelizeOptions as object)
    .then(async () => {})
    .catch((err) => {
      console.log(err);
      // process.exit();
    });

  return db;
};
