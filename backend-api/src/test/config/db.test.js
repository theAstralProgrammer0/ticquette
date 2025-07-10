import mongoose from 'mongoose';
import dbClient from '../db.js';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: { readyState: 1 },
}));

describe('DBClient', () => {
  beforeEach(() => {
    dbClient.isConnected = false;
    mongoose.connect.mockClear();
  });

  it('should set isConnected to true on successful connection', async () => {
    mongoose.connect.mockResolvedValueOnce();
    await dbClient.connect();
    expect(dbClient.isConnected).toBe(true);
  });

  it('should set isConnected to false on connection error', async () => {
    mongoose.connect.mockRejectedValueOnce(new Error('fail'));
    await dbClient.connect();
    expect(dbClient.isConnected).toBe(false);
  });

  it('should return true for isAlive when connected and readyState is 1', () => {
    dbClient.isConnected = true;
    mongoose.connection.readyState = 1;
    expect(dbClient.isAlive()).toBe(true);
  });

  it('should return false for isAlive when not connected', () => {
    dbClient.isConnected = false;
    mongoose.connection.readyState = 1;
    expect(dbClient.isAlive()).toBe(false);
  });

  it('should return false for isAlive when readyState is not 1', () => {
    dbClient.isConnected = true;
    mongoose.connection.readyState = 0;
    expect(dbClient.isAlive()).toBe(false);
  });
});