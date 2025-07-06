import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}/${database}`;
    this.client = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      this.connected = true;
      console.log('✅ MongoDB connected');
    }).catch((err) => {
      this.connected = false;
      console.error('❌ MongoDB connection error:', err);
    });
  }

  isAlive() {
    return mongoose.connection.readyState === 1;
  }
}

const dbClient = new DBClient();
export default dbClient;

