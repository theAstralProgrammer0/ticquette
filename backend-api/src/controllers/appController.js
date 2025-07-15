/**
 * Import required modules
 */
import redisClient from '../config/redis.js';
import dbClient from '../config/db.js';
import User from '../models/User.js';
import NFT from '../models/NFT.js';

/**
 * Get the status of the application
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * @returns {Promise} A promise that resolves to the status object
 */
export const getStatus = async (req, res) => {
  // Create a status object to store the status of Redis and DB
  const status = {
    // Check if Redis is alive
    redis: redisClient.isAlive(),
    // Check if DB is alive
    db: dbClient.isAlive()
  };

  // Return the status object
  res.status(200).json(status);
};

/**
 * Get statistics about the application
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * @returns {Promise} A promise that resolves to the statistics object
 */
export const getStats = async (req, res) => {
  // Count the number of users in the database
  const users = await User.countDocuments();
  
  // Count the number of NFTs in the database
  const nfts = await NFT.countDocuments();

  // Return the statistics object
  res.status(200).json({ users, nfts });
};