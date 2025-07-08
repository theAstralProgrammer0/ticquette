import request from 'supertest';
import express from 'express';
import router from '../index.js';

// Mock routers and controllers
jest.mock('../userRoutes.js', () => {
  const express = require('express');
  const r = express.Router();
  r.get('/users-test', (req, res) => res.status(200).json({ user: true }));
  return r;
});
jest.mock('../nftRoutes.js', () => {
  const express = require('express');
  const r = express.Router();
  r.get('/nfts-test', (req, res) => res.status(200).json({ nft: true }));
  return r;
});
jest.mock('../../controllers/appController.js', () => ({
  getStatus: (req, res) => res.status(200).json({ redis: true, db: true }),
  getStats: (req, res) => res.status(200).json({ users: 1, nfts: 2 }),
}));

const app = express();
app.use(router);

describe('Main Router', () => {
  it('should return status from /status', async () => {
    const res = await request(app).get('/status');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ redis: true, db: true });
  });

  it('should return stats from /stats', async () => {
    const res = await request(app).get('/stats');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ users: 1, nfts: 2 });
  });

  it('should use userRouter', async () => {
    const res = await request(app).get('/users-test');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: true });
  });

  it('should use nftRouter', async () => {
    const res = await request(app).get('/nfts-test');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ nft: true });
  });

  it('should 404 on unknown route', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
  });
});