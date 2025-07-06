import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import User from '../models/User';
import NFT from '../models/NFT';

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

