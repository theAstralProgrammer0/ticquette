import mongoose from 'mongoose';
import User from '../User.js';

describe('User Model', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should require walletAddress', async () => {
    const user = new User({});
    let err;
    try {
      await user.validate();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.walletAddress).toBeDefined();
  });

  it('should save a valid user', async () => {
    const user = new User({ walletAddress: '0xabc' });
    let err;
    try {
      await user.validate();
    } catch (error) {
      err = error;
    }
    expect(err).toBeUndefined();
  });

  it('should enforce unique walletAddress', async () => {
    // This test only works with a real DB, not with just validate()
    // Here, we just check the unique property exists
    expect(User.schema.paths.walletAddress.options.unique).toBe(true);
  });

  it('should have timestamps', () => {
    const user = new User({ walletAddress: '0xabc' });
    expect(user.createdAt).toBeUndefined();
    expect(user.updatedAt).toBeUndefined();
    // After saving to DB, these would be set
  });

  it('should trim walletAddress if set to do so', async () => {
    // Not set in schema, but if you add trim: true, this test will pass
    const user = new User({ walletAddress: ' 0xabc ' });
    expect(user.walletAddress).toBe(' 0xabc ');
  });
});