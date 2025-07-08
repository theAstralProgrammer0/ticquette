import { jest } from '@jest/globals';

// Mock dependencies
jest.mock('ethers', () => {
  const mockContract = {
    safeMint: jest.fn(),
  };
  const mockProvider = jest.fn();
  const mockWallet = jest.fn();
  const mockEthers = {
    JsonRpcProvider: jest.fn(() => mockProvider),
    Wallet: jest.fn(() => mockWallet),
    Contract: jest.fn(() => mockContract),
  };
  mockEthers.__mockContract = mockContract;
  return mockEthers;
});
jest.mock('fs');
jest.mock('path', () => ({
  resolve: jest.fn(() => '/mock/path/abi.json'),
  dirname: jest.fn(() => '/mock/dirname'),
}));
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));
jest.mock('url', () => ({
  fileURLToPath: jest.fn(() => '/mock/filename'),
}));

import fs from 'fs';
import * as contractUtils from '../contractUtils.js';
import { ethers } from 'ethers';

describe('contractUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SEPOLIA_URL = 'http://localhost:8545';
    process.env.PRIVATE_KEY = '0xprivkey';
    process.env.CONTRACT_ADDRESS = '0xcontract';
    fs.readFileSync.mockReturnValue(JSON.stringify({ abi: [] }));
  });

  it('should load contract ABI from file', () => {
    expect(fs.readFileSync).toHaveBeenCalled();
  });

  it('should throw if SEPOLIA_URL is missing', () => {
    delete process.env.SEPOLIA_URL;
    jest.resetModules();
    expect(() => import('../contractUtils.js')).toThrow();
  });

  it('should throw if PRIVATE_KEY is missing', () => {
    delete process.env.PRIVATE_KEY;
    jest.resetModules();
    expect(() => import('../contractUtils.js')).toThrow();
  });

  it('should throw if CONTRACT_ADDRESS is missing', () => {
    delete process.env.CONTRACT_ADDRESS;
    jest.resetModules();
    expect(() => import('../contractUtils.js')).toThrow();
  });

  it('should call contract.safeMint and return tokenId, expirationDate, and receipt', async () => {
    const mockTx = {
      wait: jest.fn().mockResolvedValue({
        logs: [
          { args: { tokenId: { toString: () => '42' } } }
        ]
      }),
    };
    ethers.__mockContract.safeMint.mockResolvedValue(mockTx);

    const result = await contractUtils.mintOnBlockchain('0xabc', 'cid123');
    expect(ethers.__mockContract.safeMint).toHaveBeenCalledWith('0xabc', 'ipfs://cid123');
    expect(result.tokenId).toBe('42');
    expect(result.receipt).toBeDefined();
    expect(result.expirationDate).toBeInstanceOf(Date);
  });
});