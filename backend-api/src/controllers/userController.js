/**
 * Import required modules
 */
import User from '../models/User.js';
import redisClient from '../config/redis.js';
import dbClient from '../config/db.js';

/**
 * Create a new user
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * @returns {Promise} A promise that resolves to the created user
 */
export const postNewUser = async (req, res) => {
  try {
    // Extract wallet address from request body
    const { walletAddress } = req.body;

    // Check if wallet address is provided
    if (!walletAddress) {
      return res.status(400).json({ error: 'Missing wallet address' });
    }

    // Create cache key for user
    const cacheKey = `user:${walletAddress}`;

    // Check if user is cached
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      // Return cached user
      return res.status(200).json(JSON.parse(cached));
    }

    // Find user in database
    let user = await User.findOne({ walletAddress });

    // If user exists, return user
    if (user) {
      const response = {
        id: user._id,
        walletAddress: user.walletAddress
      };
      // Cache user for 1 hour
      await redisClient.set(cacheKey, JSON.stringify(response), 3600);
      return res.status(200).json(response);
    }

    // Create new user
    user = await User.create({ walletAddress });

    // Create response object
    const response = {
      id: user._id,
      walletAddress: user.walletAddress
    };

    // Cache user for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(response), 3600);

    // Return created user
    return res.status(200).json(response);
  } catch (error) {
    // Log error and return internal server error
    console.error('Error in postNewUser:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all users
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * @returns {Promise} A promise that resolves to an array of users
 */
export const getAllUsers = async (req, res) => {
  try {
    // Create cache key for all users
    const cacheKey = 'users:all';

    // Check if users are cached
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      // Return cached users
      return res.status(200).json(JSON.parse(cached));
    }

    // Find all users in database
    const users = await User.find().select('_id walletAddress');

    // Create response object
    const response = users.map(u => ({
      id: u._id,
      walletAddress: u.walletAddress
    }));

    // Cache users for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(response), 300);

    // Return users
    return res.status(200).json(response);
  } catch (error) {
    // Log error and return internal server error
    console.error('Error in getAllUsers: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get user by ID
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * @returns {Promise} A promise that resolves to the user
 */
export const getUserById = async (req, res) => {
  try {
    // Extract user ID from request parameters
    const { id } = req.params;

    // Create cache key for user
    const cacheKey = `user:id:${id}`;

    // Check if user is cached
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      // Return cached user
      return res.status(200).json(JSON.parse(cached));
    }

    // Find user in database
    const user = await User.findById(id).select('_id walletAddress');

    // If user does not exist, return not found error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create response object
    const response = {
      id: user._id,
      walletAddress: user.walletAddress
    };

    // Cache user for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(response), 300);

    // Return user
    return res.status(200).json(response);
  } catch (error) {
    // Log error and return internal server error
    console.error('Error in getUserById: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
