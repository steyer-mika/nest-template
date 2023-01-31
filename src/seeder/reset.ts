import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const script = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const collections = await db.collections();
    await Promise.all(collections.map(async (collection) => collection.drop()));
    return process.exit(0);
  } catch (error) {
    return process.exit(1);
  }
};
script();
