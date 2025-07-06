import mongoose from 'mongoose';

const nftSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true
  },
  metadataCID: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  leaseDuration: {
    type: Number,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const NFT = mongoose.model('MFT', nftSchema);
export default NFT;

