/**
 * Import required modules
 */
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Get the current file path and directory
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Define the path to the contract ABI file
 */
const abiPath = path.resolve(__dirname, '../../../smart-contract/artifacts/contracts/TicquetteNFT.sol/TicquetteNFT.json');

/**
 * Load the contract ABI from the file
 */
let contractABI;
try {
  const abiContent = fs.readFileSync(abiPath, 'utf8');
  contractABI = JSON.parse(abiContent);
} catch (error) {
  console.error(`Error loading contract ABI from ${abiPath}:`, error);
  process.exit(1);
}

/**
 * Define environment variables
 */
const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

/**
 * Validate environment variables
 */
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

/**
 * Create a new JSON RPC provider instance
 */
const provider = new ethers.JsonRpcProvider(SEPOLIA_URL);

/**
 * Create a new wallet instance
 */
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

/**
 * Create a new contract instance
 */
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

/**
 * Mint a new NFT on the blockchain
 * 
 * @param {string} walletAddress - The wallet address of the NFT owner
 * @param {string} metadataCID - The Content ID of the NFT metadata
 * 
 * @returns {Promise<{tokenId: string, expirationDate: Date, receipt: object}>}
 */
export const mintOnBlockchain = async (walletAddress, metadataCID) => {
  /**
   * Call the safeMint function on the contract
   */
  const tx = await contract.safeMint(walletAddress, `ipfs://${metadataCID}`);

  /**
   * Wait for the transaction to be mined
   */
  const receipt = await tx.wait();

  console.log(receipt);

  /**
   * Extract the token ID from the receipt
   */
  const tokenId = receipt.logs[0].args.tokenId.toString();

  /**
   * Calculate the expiration date (default 1 year)
   */
  const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  return { tokenId, expirationDate, receipt };
};