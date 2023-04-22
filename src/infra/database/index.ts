/* eslint-disable */
import sequelize from '../sequelize';
//@ts-ignore
export default ({ logger, config }) => {
  const { db = null } = config;
  if (!db) {
    logger.error('Database config file log not found, disabling database.');
    return false;
  }

  return sequelize({ basePath: __dirname, config });
};
