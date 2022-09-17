import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
const mongod = new MongoMemoryServer();

const connect = async (): Promise<void> => {
  const mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  const mongooseOpts: any = {
    useNewUrlParser: true,
    // autoReconnect: true,
    // reconnectTries: Number.MAX_VALUE,
    // reconnectInterval: 1000,
  };

  await mongoose.connect(uri, mongooseOpts);
};

const close = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

const clear = async (): Promise<void> => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export {
  MongoMemoryServer,
  connect,
  close,
  clear,
}
