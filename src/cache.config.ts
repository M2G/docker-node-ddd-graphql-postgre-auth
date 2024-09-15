import * as redis from 'redis';
import * as console from 'console';

const HOST = process.env.NODE_ENV === 'development' ? 'redis' : 'localhost';

const portRedis = process.env.CONTAINER_PORT_REDIS ?? 6379;

const redisOptions = {
  host: HOST,
  legacyMode: true,
  port: Number(portRedis),
};

function createClient() {
  const client = redis.createClient({
    socket: { host: redisOptions.host, port: redisOptions.port },
  });

  client.on('error', (err) => {
    console.error('Failed redis createClient', err);
  });

  if (!client.isOpen) {
    (async () => {
      await client.connect();
      console.info('Connected to Redis');
    })();
  }

  client.on('connect', () => {
    console.info('Succeeded redis createClient', redisOptions);
  });

  return client;
}

const redisClient = createClient();

export default redisClient;
