import request from 'supertest';
import express from 'express';
import nftRouter from '../nftRoutes.js';

// Mock controller functions
jest.mock('../../controllers/nftController.js', () => ({
  mintNFT: (req, res) => res.status(201).json({ minted: true }),
  getAllNFTs: (req, res) => res.status(200).json([{ tokenId: '1' }]),
  getNFTByTokenId: (req, res) => res.status(200).json({ tokenId: req.params.tokenId }),
  transferNFTOwnership: (req, res) => res.status(200).json({ transferred: true }),
}));

const app = express();
app.use(express.json());
app.use(nftRouter);

describe('nftRoutes', () => {
  it('POST /mint should call mintNFT', async () => {
    const res = await request(app).post('/mint').send({ walletAddress: '0xabc' });
    expect(res.status).toBe(201);
    expect(res.body.minted).toBe(true);
  });

  it('GET /nfts should call getAllNFTs', async () => {
    const res = await request(app).get('/nfts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].tokenId).toBe('1');
  });

  it('GET /nft/:tokenId should call getNFTByTokenId', async () => {
    const res = await request(app).get('/nft/123');
    expect(res.status).toBe(200);
    expect(res.body.tokenId).toBe('123');
  });

  // If you add a transfer route, test it here as well
  // it('PUT /nft/:tokenId/transfer should call transferNFTOwnership', async () => {
  //   const res = await request(app).put('/nft/123/transfer').send({ newWalletAddress: '0xnew' });
  //   expect(res.status).toBe(200);
  //   expect(res.body.transferred).toBe(true);
  // });
});