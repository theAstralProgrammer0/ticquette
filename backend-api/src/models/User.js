/**
 * Import required modules
 */
import mongoose from 'mongoose';

/**
 * Define the schema for the User model
 */
const userSchema = new mongoose.Schema({
  /**
   * Unique wallet address of the user
   * @type {String}
   * @required
   * @unique
   */
  walletAddress: { type: String, required: true, unique: true }
}, {
  /**
   * Automatically add createdAt and updatedAt timestamps to the document
   */
  timestamps: true
});

/**
 * Create the User model based on the schema
 */
const User = mongoose.model('User', userSchema);

/**
 * Export the User model
 */
export default User;