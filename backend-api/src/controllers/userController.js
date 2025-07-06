import User from '../models/User';

export const postNewUser = async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ error: 'Missing wallet address' });

  const existingUser = await User.findOne({ walletAddress });
  if (existingUser) return res.status(200).json({ id: existingUser._id, walletAddress: existingUser.walletAddress });

  const newUser = await User.create({ walletAddress });
  return res.status(201).json({ id: newUser._id, walletAddress: newUser.walletAddress });
};

