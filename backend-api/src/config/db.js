import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

class DBClient {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'test';
    const uri = `mongodb://${host}:${port}/${dbName}`;
    console.log(uri);

    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.isConnected = true;
      console.log('MongoDB Connection Successful...');
    }
    catch (err) {
      this.isConnected = false;
      console.error('MongoDB Connection Error:', err);
    }
  }

  isAlive() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

const dbClient = new DBClient();
export default dbClient;

