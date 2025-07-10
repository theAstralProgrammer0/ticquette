import request from 'supertest';
import express from 'express';
import * as appController from '../appController.js';
import redisClient from '../../config/redis.js';
import dbClient from '../../config/db.js';
import User from '../../models/User.js';
import NFT from '../../models/NFT.js';

// Mock dependencies
jest.mock('../../config/redis.js');
jest.mock('../../config/db.js');
jest.mock('../../models/User.js');
jest.mock('../../models/NFT.js');

const app = express();
app.get('/status', appController.getStatus);
app.get('/stats', appController.getStats);

describe('appController', () => {
  describe('getStatus', () => {
    it('should return redis and db status', async () => {
      redisClient.isAlive.mockReturnValue(true);
      dbClient.isAlive.mockReturnValue(false);

      const res = await request(app).get('/status');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ redis: true, db: false });
    });
  });

  describe('getStats', () => {
    it('should return user and nft counts', async () => {
      User.countDocuments.mockResolvedValueOnce(5);
      NFT.countDocuments.mockResolvedValueOnce(10);

      const res = await request(app).get('/stats');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ users: 5, nfts: 10 });
    });

    it('should handle errors gracefully', async () => {
      User.countDocuments.mockRejectedValueOnce(new Error('fail'));
      NFT.countDocuments.mockResolvedValueOnce(0);

      const res = await request(app).get('/stats');
      // Since there is no error handling in getStats, this will throw and not return 200.
      // You may want to add error handling in your controller for production use.
      expect(res.status).not.toBe(200);
    });
  });
});