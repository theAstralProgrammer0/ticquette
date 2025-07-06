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

export const getUsers = async (req, res) => {
    // Get all users
    // No authentication check yet
    const users = await User.find();
    return res.status(200).json({ "users": users });
  };

  export const getUserById = async (req, res) => {
    // Get a user by Id
    // No authorization check yet
    const { id } = req.params;
    const Id = parseInt(id);
    try {
        const user = await User.findById(Id);
        return res.status(200).json({ "User": user })   
    } catch (error) {
        console.log(error);
        res.status(504).json({ "error": "Internal server error" });
    }
}
