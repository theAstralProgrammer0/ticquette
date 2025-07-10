/**
 * Import required modules
 */
import { createClient } from 'redis';

/**
 * Class representing a Redis client
 */
class RedisClient {
  /**
   * Constructor
   */
  constructor() {
    /**
     * Create a new Redis client instance
     */
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    /**
     * Listen for error events on the Redis client
     */
    this.client.on('error', (err) => console.error('Redis Client Error:', err));

    /**
     * Connect to the Redis server
     */
    this.client.connect().catch((err) => console.error('Redis Connect Error:', err));
  }

  /**
   * Check if the Redis client is connected
   * @returns {boolean}
   */
  isAlive() {
    return this.client.isOpen;
  }

  /**
   * Get the value associated with a key
   * @param {string} key - The key to retrieve
   * @returns {Promise<string|null>}
   */
  async get(key) {
    try {
      /**
       * Retrieve the value associated with the key
       */
      const value = await this.client.get(key);
      console.log("Redis GET operation successful");
      return value;
    } catch (err) {
      console.error("Redis GET operation error: ", err);
      return null;
    }
  }

  /**
   * Set the value associated with a key
   * @param {string} key - The key to set
   * @param {string} val - The value to set
   * @param {number} duration - The expiration time in seconds
   * @returns {Promise<void>}
   */
  async set(key, val, duration) {
    try {
      /**
       * Set the value associated with the key
       */
      await this.client.set(key, String(val), { EX: duration });
      console.log("Redis SET operation successful");
    } catch (err) {
      console.error("Redis SET operation error: ", err);
    }
  }

  /**
   * Delete a key
   * @param {string} key - The key to delete
   * @returns {Promise<void>}
   */
  async del(key) {
    try {
      /**
       * Delete the key
       */
      await this.client.del(key);
      console.log("Redis DEL operation successful");
    } catch (err) {
      console.error("Redis DEL operation error: ", err);
    }
  }
}

/**
 * Create a new instance of the RedisClient class
 */
const redisClient = new RedisClient();

/**
 * Export the RedisClient instance
 */
export default redisClient;