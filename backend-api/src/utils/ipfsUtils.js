import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';
dotenv.config();

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export const pinMetadataToIPFS = async (metadata) => {
  const options = { pinataMetadata: { name: 'Ticquette Metadata' } };
  const result = await pinata.pinJSONToIPFS(metadata, options);
  return result.IpfsHash;
};

