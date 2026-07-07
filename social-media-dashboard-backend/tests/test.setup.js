const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
jest.mock('ioredis');
jest.mock('bullmq');

let mongoServer;

module.exports = {
  setup: async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  },
  teardown: async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  },
  clearDatabase: async () => {
    if (mongoose.connection.readyState !== 0) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
      }
    }
  }
};
