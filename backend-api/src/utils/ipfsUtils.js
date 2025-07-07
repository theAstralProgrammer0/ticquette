import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';
dotenv.config();

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

export const pinMetadataToIPFS = async (metadata) => {
  try {
    console.log("Attempting to pin JSON to IPFS...");
    const options = {
      pinataMetadata: { name: 'Ticquette Metadata' },
      pinataOptions: { cidVersion: 1 }
    };
    const result = await pinata.pinJSONToIPFS(metadata, options);
    if (result) {
      console.log('JSON pinned to IPFS successfully!');
      console.log('IPFS Hash (CID):', result.IpfsHash);
    };
    return result.IpfsHash;
  }
  catch (err) {
    console.error('❌ Error pinning JSON to IPFS:', err);
    throw err;
  }
};

