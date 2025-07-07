import User from '../models/User.js';
import redisClient from '../config/redis.js';
import dbClient from '../config/db.js';

export const postNewUser = async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ error: 'Missing wallet address' });

  try {
    const cacheKey = `user:${walletAddress}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    let user = await User.findOne({ walletAddress });
    if (user) {
      const response = { id: user._id, walletAddress: user.walletAddress };
      await redisClient.set(cacheKey, JSON.stringify(response), 3600);
      return res.status(200).json(response);
    }

    user = await User.create({ walletAddress });
    const response = { id: user._id, walletAddress: user.walletAddress };
    await redisClient.set(cacheKey, JSON.stringify(response), 3600);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in postNewUser:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const cacheKey = 'users:all';
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const users = await User.find().select('_id walletAddress');
    const response = users.map(u => ({ id: u._id, walletAddress: u.walletAddress }));
    await redisClient.set(cacheKey, JSON.stringify(response), 300);
    return res.status(200).json(response);
  }
  catch (error) {
    console.error('Error in getAllUsers: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `user:id:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const user = await User.findById(id).select('_id walletAddress');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const response = { id: user._id, walletAddress: user.walletAddress };
    await redisClient.set(cacheKey, JSON.strimgify(response), 300);
    return res.status(200).json(response);
  }
  catch (error) {
    console.error('Error in getUserNyId: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
