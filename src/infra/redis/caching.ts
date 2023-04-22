/*eslint-disable*/
// @ts-ignore
import redis, { ClientOpts as RedisOptions } from 'redis';
import validatedTtl from './validatedTtl';

const HOST = process.env.NODE_ENV === 'development' ? 'redis' : 'localhost';

const portRedis = process.env.HOST_PORT_REDIS || 6379;

const createClient = (redisOptions: RedisOptions) => {
  console.log('Start redis createClient', redisOptions);
  const client = redis.createClient(redisOptions);

  client.on('error', (err: any) => {
    console.log('Failed redis createClient', err);
  });
  client.on('connect', () => {
    console.log('Succeeded redis createClient', redisOptions);
  });

  return client;
};

const redisOptions: RedisOptions = {
  port: Number(portRedis),
  host: HOST
};

const redisClient = createClient(redisOptions) as any;

const TTL = 5 * 60;

let defaultTtlInS = validatedTtl(TTL);

export default ({ config }: any) => {
  /**
   * Scans the entire Redis keyspace to find matching keys. The matching
   * keys are returned in sets via the `eachScanCallback` function which is
   * called after each iteration of the Redis `SCAN` command. This method is
   * useful if you want to operate on chunks and/or perform work with results
   * at the same time as the keyspace is being scanned. That is, you want to
   * be efficient while searching through or expecting to match on tens of
   * thousands or even millions of keys.
   *
   * @name eachScan
   *
   * @method
   *
   * @param {String} pattern - A Redis glob-style string pattern of keys to
   * match. See: https://redis.io/commands/scan#the-match-option
   *
   * @param {Object} [options = {method: 'scan', key: '', count: 0}] - An
   * optional object representing options for controlling the scan.
   * Available options:
   * * `method` - The string name of the method for this scan.
   * Used for performing scans of a hash ('hscan'), set ('sscan'), or sorted
   * set ('zscan').
   * * `key` - The string key name used for HSCAN, SSCAN, or ZSCAN.
   * * `count` - A number representing the amount of "work" we want to do
   * with each iteration of the given SCAN command. Increase this to hundreds
   * or thousands to speed up scans of huge keyspaces.
   * See: https://redis.io/commands/scan#the-count-option
   * * `type` - A string name of a Redis key type. Used for searching
   * the entire Redis key space for keys of a certain type.
   * See: https://redis.io/commands/scan#the-type-option
   * * `limit` - A number representing a limit for how many results
   * should be returned. Because of the nature of the Redis SCAN
   * command and possible interaction with the `count` option we can
   * never guarantee returning this exact limit. As soon as we reach
   * or exceed the limit then we halt the scan and call the final
   * callback appropriately.
   *
   * @param {Function} eachScanCallback - A function called after each
   * call to the Redis `SCAN` command. Invoked with (matchingKeys).
   * If this function returns boolean `true` then this signals cancellation
   * of the scan. No further `SCAN` commands will be run and the final
   * callback will be called with the current count of matching keys.
   * This allows us to halt a scan before it has finished.
   *
   * @param {Function} [callback] - A function called after the full scan has
   * completed and all keys have been returned.
   * Invoked with (err, matchCount).
   */
  const eachScan = (
    pattern: string,
    options: object,
    eachScanCallback: Function,
    callback: Function
  ) => {
    if (!callback) {
      callback = eachScanCallback;
      //@ts-ignore
      eachScanCallback = options;
      options = {};
    }
    //@ts-ignore
    const method = options.method || 'scan';
    //@ts-ignore
    const key = options.key || '';
    //@ts-ignore
    const count = options.count || 0;
    //@ts-ignore
    const type = options.type || '';
    //@ts-ignore
    const limit = options.limit || Infinity;

    let matchesCount = 0;

    // Because we're using the `scan()` method of the node-redis library
    // a recursive function seems easiest here.
    const recursiveScan = (cursor = 0) => {
      // Build `SCAN` command parameters using the `MATCH` option
      // and a possible key.
      let parameters = [cursor, 'MATCH', pattern];
      if (key) {
        parameters = [key, cursor, 'MATCH', pattern];
      }

      // Add any custom `COUNT` scan option.
      if (count > 0) {
        parameters.push('COUNT', count);
      }

      // Add any custom `TYPE` scan option.
      if (type) {
        parameters.push('TYPE', type);
      }

      redisClient[method](...parameters, (err: any, data: [any, any]) => {
        if (err) {
          callback(err);
        } else {
          // Scan calls return an array with two elements. The
          // first element is the next cursor and the second is an
          // array of matches (which might be empty). We'll
          // destructure this into two variables.
          const [cursor, matches] = data;

          matchesCount += matches.length;
          const cancel = eachScanCallback(matches);

          // We're done when any of the following happen:
          // - Redis returns 0 for the next cursor
          // - We have the number of results desired via limit
          // - The return value of eachScanCallback is `true`
          if (cursor === '0' || matchesCount >= limit || cancel === true) {
            callback(null, matchesCount);
          } else {
            // Otherwise, call this function again AKA recurse
            // and pass the next cursor.
            recursiveScan(cursor);
          }
        }
      });
    };

    // Begin the scan.
    recursiveScan();
  };

  /**
   * Scans the entire Redis keyspace to find matching keys. The matching
   * keys are returned as an array of strings via callback. Depending on
   * the size of your keyspace this function might not be ideal for
   * performance. It may take tens of seconds or more for Redis databases
   * with huge keyspaces (i.e. millions of keys or more).
   *
   * @name scan
   *
   * @method
   *
   * @param {String} pattern - A Redis glob-style string pattern of keys to
   * match.
   *
   * @param {Object} [options] - See eachScan options parameter documentation.
   *
   * @param {Function} [callback] - A function called after the full scan
   * of the Redis keyspace completes having searched for the given pattern.
   * Invoked with (err, matchingKeys).
   */
  const scan = (pattern: string, options: object = {}, callback: Function) => {
    if (!callback) {
      //@ts-ignore
      callback = options;
      options = {};
    }

    let keys: any[] = [];

    // Collect all our keys into a single array using the `eachScan()`
    // method from above.
    eachScan(
      pattern,
      options,
      (matchingKeys: any) => {
        keys = keys.concat(matchingKeys);
      },
      (err: any) => {
        if (err) {
          callback(err);
        } else {
          callback(null, keys);
        }
      }
    );
  };

  /**
   * Returns 'OK' if successful
   *
   * @param key - key for the value stored
   * @param value - value to stored
   * @param ttlInSeconds - time to live in seconds
   * @returns 'OK' if successful
   */

  const set = (key: string, value: any, ttlInSeconds?: number): boolean => {
    const str = Array.isArray(value) ? JSON.stringify(value) : value;

    const ttl = validatedTtl(ttlInSeconds, defaultTtlInS);

    if (ttl) return redisClient.setex(key, ttl, str);

    return redisClient.set(key, str);
  };

  /**
   * Returns value or null when the key is missing - See [redis get]{@link https://redis.io/commands/get}
   * @async
   * @param key - key for the value stored
   * @returns value or null when the key is missing
   */

  const get = (key: string): Promise<Error | string | null> => {
    return new Promise((resolve, reject) => {
      return redisClient.get(key, (err: Error | null, res: string | null) => {
        if (err) return reject(err);

        return resolve(res ? JSON.parse(<string>res) : null);
      });
    });
  };
  /**
   * Returns 'OK' if successful
   * @async
   * @param key          - key for the value stored
   * @param value        - value to stored
   * @param ttlInSeconds - time to live in seconds
   * @returns
   */
  const getset = async (
    key: string,
    value: any,
    ttlInSeconds: number | undefined
  ): Promise<any> => {
    const str = Array.isArray(value) ? JSON.stringify(value) : value;

    const ttl = validatedTtl(ttlInSeconds, defaultTtlInS);

    let result = redisClient.getset(key, str) as any;

    try {
      result = JSON.parse(result);
    } catch (e: any) {
      // do nothing
      throw new Error(e);
    }

    if (ttl) {
      redisClient.expire(key, ttl);
    }
    return result;
  };

  /**
   * Returns 'PONG'
   *
   * @param str - string passed
   * @returns 'PONG'/string passed
   */

  const ping = (str?: string | any): boolean =>
    redisClient.ping(str ? str : []);

  /**
   * Returns 1 if the timeout was set/ 0 if key does not exist or the timeout could not be set - See [redis expire]{@link https://redis.io/commands/expire}
   *
   * @param   {string}  key          - key to set expire
   * @param   {number}  ttlInSeconds - time to live in seconds
   * @returns 1 if the timeout was set successfully; if not 0
   */

  const expire = (key: string, ttlInSeconds: number): boolean => {
    const ttl = validatedTtl(ttlInSeconds);
    return redisClient.expire(key, <number>ttl);
  };

  /**
   * Returns all keys matching pattern - See [redis keys]{@link https://redis.io/commands/keys}
   *
   * @param pattern - glob-style patterns/default '*'
   * @returns all keys matching pattern
   */
  const keys = (pattern = '*'): boolean => {
    return redisClient.keys(pattern);
  };

  /**
   * Unsets the defaultTtlInS
   * @returns true
   */
  const unsetDefaultTtlInS = (): boolean => {
    defaultTtlInS = undefined;
    return true;
  };

  /**
   * Return the defaultTtlInS
   * @returns defaultTtlInS
   */
  const getDefaultTtlInS = (): number | undefined => {
    return defaultTtlInS;
  };

  /**
   * Sets the defaultTtlInS
   * @param ttl
   * @returns defaultTtlInS
   */

  const setDefaultTtlInS = (ttl: number): number | undefined => {
    defaultTtlInS = validatedTtl(ttl);
    return defaultTtlInS;
  };

  return {
    eachScan,
    scan,
    set,
    get,
    getset,
    ping,
    expire,
    keys,
    unsetDefaultTtlInS,
    getDefaultTtlInS,
    setDefaultTtlInS
  };
};
