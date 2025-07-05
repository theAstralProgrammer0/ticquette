import { ethers } from 'ethers';
import contractABI from '../../artifacts/contracts/TicquetteNFT.sol/TicquetteNFT.json').abi;
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

exports.safeMintNFT = async (to, tokenURI, meta) => {
  const tx = await contract.safeMint(
    to,
    tokenURI,
    meta.useOfSpace,
    meta.dimensionOfSpace,
    meta.lga,
    meta.state,
    meta.country,
    meta.durationOfLease
  );

  const receipt = await tx.wait();
  const tokenId = receipt.events.find(e => e.event === 'TicquetteMinted').args.tokenId.toString();

  return { tokenId, receipt };
};

