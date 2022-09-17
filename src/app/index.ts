/*eslint-disable*/
/**
 * We want to start here so we can manage other infrastructure
 * database
 * memcache
 * express server
 */
export default ({ server, database }: any) => ({
    start: () =>
      Promise.resolve()
        .then(database.authenticate)
        .then(server.start),
  });
