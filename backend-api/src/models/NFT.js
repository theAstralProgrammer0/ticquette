/**
 * Import required modules
 */
import mongoose from 'mongoose';

/**
 * Define the schema for the NFT model
 */
const nftSchema = new mongoose.Schema({
  /**
   * Unique token ID of the NFT
   * @type {String}
   * @required
   */
  tokenId: { type: String, required: true },

  /**
   * Content ID of the NFT metadata stored on IPFS
   * @type {String}
   * @required
   */
  metadataCID: { type: String, required: true },

  /**
   * Wallet address of the NFT owner
   * @type {String}
   * @required
   */
  owner: { type: String, required: true },

  /**
   * Duration of the NFT lease in seconds
   * @type {Number}
   * @required
   */
  leaseDuration: { type: Number, required: true },

  /**
   * Date and time when the NFT lease expires
   * @type {Date}
   * @required
   */
  expirationDate: { type: Date, required: true }
}, {
  /**
   * Automatically add createdAt and updatedAt timestamps to the document
   */
  timestamps: true
});

/**
 * Create the NFT model based on the schema
 */
const NFT = mongoose.model('NFT', nftSchema);

/**
 * Export the NFT model
 */
export default NFT;