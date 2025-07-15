/**
 * Validate metadata for a space listing
 * 
 * @param {object} data - The metadata to validate
 * 
 * @returns {string|null} An error message if validation fails, or null if validation succeeds
 */
export const validateMetadata = (data) => {
  /**
   * Check if use of space is provided
   */
  if (!data.useOfSpace) return 'Use of space is required';

  /**
   * Check if description is provided
   */
  if (!data.description) return 'Description is required';

  /**
   * Check if dimension of space is provided
   */
  if (!data.dimensionOfSpace) return 'Dimension of space is required';

  /**
   * Check if LGA (Local Government Area) is provided
   */
  if (!data.lga) return 'LGA is required';

  /**
   * Check if state is provided
   */
  if (!data.state) return 'State is required';

  /**
   * Check if country is provided
   */
  if (!data.country) return 'Country is required';

  /**
   * Check if lease duration is provided
   */
  if (!data.durationOfLease) return 'Lease duration is required';

  /**
   * If all checks pass, return null to indicate valid metadata
   */
  return null;
};