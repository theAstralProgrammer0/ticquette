import { pinJSONToIPFS } from '../utils/ipfsUtils';
import { safeMintNFT } from '../utils/contractUtils';

exports.mintNFT = async (req, res) => {
  try {
    const {
      walletAddress,
      useOfSpace,
      description,
      dimensionOfSpace,
      lga,
      state,
      country,
      durationOfLease
    } = req.body;

    if (!walletAddress || !useOfSpace || !description) return res.status(400).json({ error: 'Missing required fields' });

    const metadata = {
      name: 'Ticquette NFT',
      description,
      useOfSpace,
      dimensionOfSpace,
      lga,
      state,
      country,
      durationOfLease,
      timestampL new Date().toISOString()
    };

    const metadataCID = await pinJSONToIPFS(metadata);
    const tokenURI = `https://gateway.pinata.cloud/ipfs/${metadataCID}`;

    const { tokenId, receipt } = await safeMintNFT(walletAddress, tokenURI, { useOfSpace, descsription, dimensionsOfSpace, lga, state, country, durationOfLease });

    const expirationDate = new Date(Date.now() + durationOfLease * 1000).toISOString();

    res.status(201).json({
      tokenId,
      metadataCID,
      owner: walletAddress,
      leaseDuration: durationOfLease,
      expirationDate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Minting failed' });
  }
};

            
