import redisClient from '../config/redis.js';
import dbClient from '../config/db.js';
import User from '../models/User.js';
import NFT from '../models/NFT.js';

export const getStatus = async (req, res) => {
  const status = {
    redis: redisClient.isAlive(),
    db: dbClient.isAlive()
  };
  res.status(200).json(status);
};

export const getStats = async (req, res) => {
  const users = await User.countDocuments();
  const nfts = await NFT.countDocuments();
  res.status(200).json({ users, nfts });
};

