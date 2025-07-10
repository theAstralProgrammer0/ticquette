/**
 * Import required modules
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Class representing a MongoDB client
 */
class DBClient {
  /**
   * Constructor
   */
  constructor() {
    /**
     * Flag indicating whether the client is connected to the database
     * @type {boolean}
     */
    this.isConnected = false;
  }

  /**
   * Connect to the MongoDB database
   * @returns {Promise<void>}
   */
  async connect() {
    /**
     * Database host
     * @type {string}
     */
    const host = process.env.DB_HOST || 'localhost';

    /**
     * Database port
     * @type {number}
     */
    const port = process.env.DB_PORT || 27017;

    /**
     * Database name
     * @type {string}
     */
    const dbName = process.env.DB_DATABASE || 'test';

    /**
     * MongoDB connection URI
     * @type {string}
     */
    const uri = `mongodb://${host}:${port}/${dbName}`;

    console.log(uri);

    try {
      /**
       * Connect to the MongoDB database using Mongoose
       */
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      /**
       * Set the connection flag to true
       */
      this.isConnected = true;

      console.log('MongoDB Connection Successful...');
    } catch (err) {
      /**
       * Set the connection flag to false
       */
      this.isConnected = false;

      console.error('MongoDB Connection Error:', err);
    }
  }

  /**
   * Check if the client is connected to the database
   * @returns {boolean}
   */
  isAlive() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

/**
 * Create a new instance of the DBClient class
 */
const dbClient = new DBClient();

/**
 * Export the DBClient instance
 */
export default dbClient;