import User from '../models/User';
import redisClient from '../config/redis';
import dbClient from '../config/db';

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

