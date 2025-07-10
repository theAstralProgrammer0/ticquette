/**
 * Import required modules
 */
import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Create a new Pinata SDK instance with API keys
 */
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

/**
 * Pin metadata to IPFS using Pinata SDK
 * 
 * @param {object} metadata - The metadata to pin to IPFS
 * 
 * @returns {Promise<string>} A promise that resolves to the IPFS hash (CID) of the pinned metadata
 */
export const pinMetadataToIPFS = async (metadata) => {
  try {
    console.log("Attempting to pin JSON to IPFS...");

    /**
     * Define options for Pinata SDK
     */
    const options = {
      pinataMetadata: {
        name: 'Ticquette Metadata'
      },
      pinataOptions: {
        cidVersion: 1
      }
    };

    /**
     * Pin metadata to IPFS using Pinata SDK
     */
    const result = await pinata.pinJSONToIPFS(metadata, options);

    if (result) {
      console.log('JSON pinned to IPFS successfully!');
      console.log('IPFS Hash (CID):', result.IpfsHash);
    };

    /**
     * Return the IPFS hash (CID) of the pinned metadata
     */
    return result.IpfsHash;
  } catch (err) {
    console.error('❌ Error pinning JSON to IPFS:', err);
    throw err;
  }
};