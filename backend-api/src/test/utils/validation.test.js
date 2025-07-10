import { validateMetadata } from '../validation.js';

describe('validateMetadata', () => {
  it('should return null for valid metadata', () => {
    const valid = {
      useOfSpace: 'office',
      description: 'desc',
      dimensionOfSpace: '10x10',
      lga: 'LGA',
      state: 'State',
      country: 'Country',
      durationOfLease: 12,
    };
    expect(validateMetadata(valid)).toBeNull();
  });

  it('should require useOfSpace', () => {
    const data = { description: 'desc', dimensionOfSpace: '10x10', lga: 'LGA', state: 'State', country: 'Country', durationOfLease: 12 };
    expect(validateMetadata(data)).toBe('Use of space is required');
  });

  it('should require description', () => {
    const data = { useOfSpace: 'office', dimensionOfSpace: '10x10', lga: 'LGA', state: 'State', country: 'Country', durationOfLease: 12 };
    expect(validateMetadata(data)).toBe('Description is required');
  });

  it('should require dimensionOfSpace', () => {
    const data = { useOfSpace: 'office', description: 'desc', lga: 'LGA', state: 'State', country: 'Country', durationOfLease: 12 };
    expect(validateMetadata(data)).toBe('Dimension of space is required');
  });

  it('should require lga', () => {
    const data = { useOfSpace: 'office', description: 'desc', dimensionOfSpace: '10x10', state: 'State', country: 'Country', durationOfLease: 12 };
    expect(validateMetadata(data)).toBe('LGA is required');
  });

  it('should require state', () => {
    const data = { useOfSpace: 'office', description: 'desc', dimensionOfSpace: '10x10', lga: 'LGA', country: 'Country', durationOfLease: 12 };
    expect(validateMetadata(data)).toBe('State is required');
  });

  it('should require country', () => {
    const data = { useOfSpace: 'office', description: 'desc', dimensionOfSpace: '10x10', lga: 'LGA', state: 'State', durationOfLease: 12 };
    expect(validateMetadata(data)).toBe('Country is required');
  });

  it('should require durationOfLease', () => {
    const data = { useOfSpace: 'office', description: 'desc', dimensionOfSpace: '10x10', lga: 'LGA', state: 'State', country: 'Country' };
    expect(validateMetadata(data)).toBe('Lease duration is required');
  });
});