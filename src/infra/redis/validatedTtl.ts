export default (
  ttlInSeconds: any,
  defaultTtlInS?: number,
): number | undefined => {
  // validate only if ttl is given
  if (!ttlInSeconds) {
    return defaultTtlInS;
  }

  const ttl = parseInt(ttlInSeconds as string, 10);
  if (Number.isNaN(ttl) || ttl <= 0) {
    throw new Error('ttlInSeconds should be a non-zero integer');
  }
  return ttl;
};
