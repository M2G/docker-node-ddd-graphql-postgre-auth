declare module 'redis' {
  export interface RedisClient {
    set: (key: string, value: any, ttlInSeconds?: number) => boolean;
    get: (key: string) => Promise<Error | string | null>;
  }
}

declare module 'uuid' {
  export default function uuidv4(): string;
}
