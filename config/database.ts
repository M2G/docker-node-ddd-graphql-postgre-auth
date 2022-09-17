export default {
  development: {
    host: process.env.CONTAINER_PORT || 27017,
    port: process.env.PORT || 8080,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    database: process.env.MONGO_INITDB_DATABASE,
  },
  staging: {
    host: process.env.CONTAINER_PORT || 27017,
    port: process.env.PORT || 8080,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    database: process.env.MONGO_INITDB_DATABASE,
  },
  production: {
    host: process.env.CONTAINER_PORT || 27017,
    port: process.env.PORT || 8080,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    database: process.env.MONGO_INITDB_DATABASE,
  },
  test: {
    host: process.env.CONTAINER_PORT || 27017,
    port: process.env.PORT || 8080,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    database: process.env.MONGO_INITDB_DATABASE,
  },
};

