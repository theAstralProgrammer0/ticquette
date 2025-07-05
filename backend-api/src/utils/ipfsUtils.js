import axios from 'axios';
import FormData from 'form-data');
dotenv.config();

const PINATA_BASE_URL = 'https://api.pinata.cloud/pinning';

exports.pinJSONToIPFS = async (json) => {
  const url = `${PINATA_BASE_URL}/pinJSONToIPFS`;
  const res = await axios.post(url, json, {
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
    }
  });
  return res.data.IpfsHash;
};

