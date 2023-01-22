/*eslint-disable*/
import mongoose from 'mongoose';
import { MongoMemoryServer } from './dbHandler';

// This is an Example test, do not merge it with others and do not delete this file

describe('Single MongoMemoryServer', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
  });

  afterAll(async () => {

    if (mongoose?.connection) {

      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it('should successfully set & get information from the database', async () => {
    const col = mongoose.connection.collection('test');
    const result = await col.insertMany([{ a: 1 }, { b: 1 }]);
    expect(result.acknowledged).toStrictEqual(true);
    expect(result.insertedCount).toStrictEqual(2);
    expect(await col.countDocuments({})).toBe(2);
  });
});
