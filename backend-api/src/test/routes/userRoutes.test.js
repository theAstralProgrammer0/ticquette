import request from 'supertest';
import express from 'express';
import userRouter from '../userRoutes.js';

// Mock controller functions
jest.mock('../../controllers/userController.js', () => ({
  postNewUser: (req, res) => res.status(201).json({ created: true }),
  getAllUsers: (req, res) => res.status(200).json([{ id: '1', walletAddress: '0xabc' }]),
  getUserById: (req, res) => res.status(200).json({ id: req.params.id, walletAddress: '0xabc' }),
}));

const app = express();
app.use(express.json());
app.use(userRouter);

describe('userRoutes', () => {
  it('POST /users should call postNewUser', async () => {
    const res = await request(app).post('/users').send({ walletAddress: '0xabc' });
    expect(res.status).toBe(201);
    expect(res.body.created).toBe(true);
  });

  it('GET /users should call getAllUsers', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].walletAddress).toBe('0xabc');
  });

  it('GET /user/:id should call getUserById', async () => {
    const res = await request(app).get('/user/123');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('123');
    expect(res.body.walletAddress).toBe('0xabc');
  });
});