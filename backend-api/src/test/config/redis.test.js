import redisClient from '../redis.js';

jest.mock('redis', () => {
  const mClient = {
    on: jest.fn(),
    connect: jest.fn().mockResolvedValue(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    isOpen: true,
  };
  return {
    createClient: jest.fn(() => mClient),
  };
});

describe('RedisClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when client is open', () => {
    expect(redisClient.isAlive()).toBe(true);
  });

  it('should return value from get', async () => {
    redisClient.client.get.mockResolvedValueOnce('test-value');
    const value = await redisClient.get('test-key');
    expect(value).toBe('test-value');
  });

  it('should return null and log error if get fails', async () => {
    redisClient.client.get.mockRejectedValueOnce(new Error('fail'));
    const value = await redisClient.get('bad-key');
    expect(value).toBeNull();
  });

  it('should call set with correct params', async () => {
    redisClient.client.set.mockResolvedValueOnce();
    await redisClient.set('key', 'val', 60);
    expect(redisClient.client.set).toHaveBeenCalledWith('key', 'val', { EX: 60 });
  });

  it('should call del with correct key', async () => {
    redisClient.client.del.mockResolvedValueOnce();
    await redisClient.del('key-to-delete');
    expect(redisClient.client.del).toHaveBeenCalledWith('key-to-delete');
  });
});