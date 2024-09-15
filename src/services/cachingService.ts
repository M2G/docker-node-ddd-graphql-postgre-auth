import { ScanCommandOptions } from '@redis/client/dist/lib/commands/SCAN';

class RedisService {
  private redisClient: any;
  constructor(opts) {
    this.redisClient = opts.redisClient;
  }
  disconnect(): void {
    this.redisClient.disconnect();
  }

  get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  set(key: string, value: string): Promise<void> {
    return this.redisClient.set(key, value);
  }

  delete(prefix: string, key: string): Promise<void> {
    return this.redisClient.del(key);
  }

  scanIterator(options?: ScanCommandOptions): AsyncIterable<void> {
    return this.redisClient.scanIterator(options);
  }

  setWithExpiry(key: string, value: string, expiry: number): Promise<void> {
    return this.redisClient.set(key, value, 'EX', expiry);
  }
}

export default RedisService;
