import { ethers } from 'ethers';
import contractABI from '../../../smart-contract/artifacts/contracts/TicquetteNFT.sol/TicquetteNFT.json';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI.abi, signer);

export const mintOnBlockchain = async (walletAddress, metadataCID, metadata) => {
  const tx = await contract.safeMint(
    walletAddress,

