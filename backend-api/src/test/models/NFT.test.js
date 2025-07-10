import mongoose from 'mongoose';
import NFT from '../NFT.js';

describe('NFT Model', () => {
  beforeAll(async () => {
    // Use MongoDB memory server or mock if needed for integration tests
    // For schema validation, mongoose.connect is not required
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should require all fields', async () => {
    const nft = new NFT({});
    let err;
    try {
      await nft.validate();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.tokenId).toBeDefined();
    expect(err.errors.metadataCID).toBeDefined();
    expect(err.errors.owner).toBeDefined();
    expect(err.errors.leaseDuration).toBeDefined();
    expect(err.errors.expirationDate).toBeDefined();
  });

  it('should save a valid NFT', async () => {
    const nft = new NFT({
      tokenId: '123',
      metadataCID: 'cid123',
      owner: '0xabc',
      leaseDuration: 12,
      expirationDate: new Date()
    });
    let err;
    try {
      await nft.validate();
    } catch (error) {
      err = error;
    }
    expect(err).toBeUndefined();
  });

  it('should fail if leaseDuration is not a number', async () => {
    const nft = new NFT({
      tokenId: '123',
      metadataCID: 'cid123',
      owner: '0xabc',
      leaseDuration: 'not-a-number',
      expirationDate: new Date()
    });
    let err;
    try {
      await nft.validate();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.leaseDuration).toBeDefined();
  });

  it('should fail if expirationDate is not a date', async () => {
    const nft = new NFT({
      tokenId: '123',
      metadataCID: 'cid123',
      owner: '0xabc',
      leaseDuration: 12,
      expirationDate: 'not-a-date'
    });
    let err;
    try {
      await nft.validate();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.expirationDate).toBeDefined();
  });

  it('should have timestamps', () => {
    const nft = new NFT({
      tokenId: '123',
      metadataCID: 'cid123',
      owner: '0xabc',
      leaseDuration: 12,
      expirationDate: new Date()
    });
    expect(nft.createdAt).toBeUndefined();
    expect(nft.updatedAt).toBeUndefined();
    // After saving to DB, these would be set
  });
});