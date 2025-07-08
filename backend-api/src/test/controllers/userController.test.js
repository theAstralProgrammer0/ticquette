import request from 'supertest';
import express from 'express';
import * as userController from '../userController.js';
import User from '../../models/User.js';
import redisClient from '../../config/redis.js';

jest.mock('../../models/User.js');
jest.mock('../../config/redis.js');

const app = express();
app.use(express.json());
app.post('/users', userController.postNewUser);
app.get('/users', userController.getAllUsers);
app.get('/user/:id', userController.getUserById);

describe('userController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('postNewUser', () => {
    it('should return 400 if walletAddress is missing', async () => {
      const res = await request(app).post('/users').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing wallet address');
    });

    it('should return cached user if present', async () => {
      redisClient.get.mockResolvedValueOnce(JSON.stringify({ id: '1', walletAddress: '0xabc' }));
      const res = await request(app).post('/users').send({ walletAddress: '0xabc' });
      expect(res.status).toBe(200);
      expect(res.body.walletAddress).toBe('0xabc');
    });

    it('should return existing user from DB if not cached', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      User.findOne.mockResolvedValueOnce({ _id: '2', walletAddress: '0xdef' });
      redisClient.set.mockResolvedValueOnce(null);
      const res = await request(app).post('/users').send({ walletAddress: '0xdef' });
      expect(res.status).toBe(200);
      expect(res.body.walletAddress).toBe('0xdef');
    });

    it('should create and return new user if not found', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      User.findOne.mockResolvedValueOnce(null);
      User.create.mockResolvedValueOnce({ _id: '3', walletAddress: '0xghi' });
      redisClient.set.mockResolvedValueOnce(null);
      const res = await request(app).post('/users').send({ walletAddress: '0xghi' });
      expect(res.status).toBe(200);
      expect(res.body.walletAddress).toBe('0xghi');
    });

    it('should handle errors', async () => {
      redisClient.get.mockRejectedValueOnce(new Error('fail'));
      const res = await request(app).post('/users').send({ walletAddress: '0xerr' });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('getAllUsers', () => {
    it('should return cached users if present', async () => {
      redisClient.get.mockResolvedValueOnce(JSON.stringify([{ id: '1', walletAddress: '0xabc' }]));
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body[0].walletAddress).toBe('0xabc');
    });

    it('should return users from DB if not cached', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      User.find.mockResolvedValueOnce([{ _id: '2', walletAddress: '0xdef' }]);
      redisClient.set.mockResolvedValueOnce(null);
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body[0].walletAddress).toBe('0xdef');
    });

    it('should handle errors', async () => {
      redisClient.get.mockRejectedValueOnce(new Error('fail'));
      const res = await request(app).get('/users');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('getUserById', () => {
    it('should return cached user if present', async () => {
      redisClient.get.mockResolvedValueOnce(JSON.stringify({ id: '1', walletAddress: '0xabc' }));
      const res = await request(app).get('/user/1');
      expect(res.status).toBe(200);
      expect(res.body.walletAddress).toBe('0xabc');
    });

    it('should return user from DB if not cached', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      User.findById.mockResolvedValueOnce({ _id: '2', walletAddress: '0xdef' });
      redisClient.set.mockResolvedValueOnce(null);
      const res = await request(app).get('/user/2');
      expect(res.status).toBe(200);
      expect(res.body.walletAddress).toBe('0xdef');
    });

    it('should return 404 if user not found', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      User.findById.mockResolvedValueOnce(null);
      const res = await request(app).get('/user/3');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found');
    });

    it('should handle errors', async () => {
      redisClient.get.mockRejectedValueOnce(new Error('fail'));
      const res = await request(app).get('/user/4');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });
});