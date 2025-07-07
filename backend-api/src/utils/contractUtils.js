import { ethers } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const abiPath = path.resolve(__dirname, '../../../smart-contract/artifacts/contracts/TicquetteNFT.sol/TicquetteNFT.json');

let contractABI;
try {
  const abiContent = fs.readFileSync(abiPath, 'utf8');
  contractABI = JSON.parse(abiContent);
} catch (error) {
  console.error(`Error loading contract ABI from ${abiPath}:`, error);
  process.exit(1);
}

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
if (!SEPOLIA_URL) {
    console.error("Error: SEPOLIA_URL is not defined in your .env file.");
    process.exit(1);
}
if (!PRIVATE_KEY) {
    console.error("Error: PRIVATE_KEY is not defined in your .env file.");
    process.exit(1);
}
if (!CONTRACT_ADDRESS) {
    console.error("Error: CONTRACT_ADDRESS is not defined in your .env file. Please ensure your contract is deployed and its address is set.");
    process.exit(1);
}

const provider = new ethers.JsonRpcProvider(SEPOLIA_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

export const mintOnBlockchain = async (walletAddress, metadataCID) => {
  const tx = await contract.safeMint(walletAddress, `ipfs://${metadataCID}`);
  const receipt = await tx.wait();
  console.log(receipt);
  const tokenId = receipt.logs[0].args.tokenId.toString();
  const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default 1 year

  return { tokenId, expirationDate, receipt };
};

