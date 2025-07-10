import { pinMetadataToIPFS } from '../ipfsUtils.js';
import pinataSDK from '@pinata/sdk';

jest.mock('@pinata/sdk');

const mockPinJSONToIPFS = jest.fn();

beforeAll(() => {
  pinataSDK.mockImplementation(() => ({
    pinJSONToIPFS: mockPinJSONToIPFS,
  }));
});

describe('pinMetadataToIPFS', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PINATA_API_KEY = 'testkey';
    process.env.PINATA_SECRET_API_KEY = 'testsecret';
  });

  it('should pin metadata and return IpfsHash', async () => {
    mockPinJSONToIPFS.mockResolvedValueOnce({ IpfsHash: 'Qm123' });
    const metadata = { foo: 'bar' };
    const cid = await pinMetadataToIPFS(metadata);
    expect(mockPinJSONToIPFS).toHaveBeenCalledWith(
      metadata,
      expect.objectContaining({
        pinataMetadata: { name: 'Ticquette Metadata' },
        pinataOptions: { cidVersion: 1 },
      })
    );
    expect(cid).toBe('Qm123');
  });

  it('should throw and log error if pinning fails', async () => {
    const error = new Error('Pinata error');
    mockPinJSONToIPFS.mockRejectedValueOnce(error);
    const metadata = { foo: 'bar' };
    await expect(pinMetadataToIPFS(metadata)).rejects.toThrow('Pinata error');
  });

  it('should call pinataSDK with correct API keys', async () => {
    // Re-import to trigger SDK instantiation
    jest.resetModules();
    process.env.PINATA_API_KEY = 'api-key';
    process.env.PINATA_SECRET_API_KEY = 'secret-key';
    const { pinMetadataToIPFS: pinFunc } = await import('../ipfsUtils.js');
    mockPinJSONToIPFS.mockResolvedValueOnce({ IpfsHash: 'Qm456' });
    await pinFunc({ test: 'data' });
    expect(pinataSDK).toHaveBeenCalledWith('api-key', 'secret-key');
  });
});