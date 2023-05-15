/**
 * We want to start here so we can manage other infrastructure
 * database
 * memcache
 * express server
 */
export default ({ server }: any) => ({
  start: async () => Promise.resolve().then(server.start),
});
