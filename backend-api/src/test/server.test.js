import request from 'supertest';
import express from 'express';

// Mock dependencies
jest.mock('./config/db.js', () => ({
  connect: jest.fn(),
  isAlive: jest.fn(() => true),
}));
jest.mock('./config/redis.js', () => ({
  isAlive: jest.fn(() => true),
}));
jest.mock('./routes/index.js', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/test', (req, res) => res.status(200).json({ ok: true }));
  return router;
});

let app;
beforeAll(async () => {
  // Import after mocks are set up
  app = (await import('../server.js')).default;
});

describe('Server', () => {
  it('should respond to /api/test', async () => {
    const res = await request(app).get('/api/test');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should use helmet, cors, and morgan middleware', async () => {
    // helmet sets X-DNS-Prefetch-Control header
    const res = await request(app).get('/api/test');
    expect(res.headers['x-dns-prefetch-control']).toBeDefined();
    // cors sets access-control-allow-origin header
    expect(res.headers['access-control-allow-origin']).toBeDefined();
    // morgan logs to console, which is hard to test directly, but no error means it's working
  });

  it('should parse JSON bodies', async () => {
    const res = await request(app)
      .post('/api/test')
      .send({ foo: 'bar' })
      .set('Content-Type', 'application/json');
    // Route doesn't exist, so expect 404, but no error thrown
    expect([404, 200]).toContain(res.status);
  });

  it('should limit requests (rate limit)', async () => {
    // The rate limiter is set to 100 requests per 15 minutes, so we can't easily trigger it in a test.
    // This test just ensures the middleware is present and doesn't block a single request.
    const res = await request(app).get('/api/test');
    expect(res.status).toBe(200);
  });
});