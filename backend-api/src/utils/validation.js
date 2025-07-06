export const validateMetadata = (data) => {
  if (!data.useOfSpace) return 'Use of space is required';
  if (!data.description) return 'Description is required';
  if (!data.dimensionOfSpace) return 'Dimension of space is required';
  if (!data.lga) return 'LGA is required';
  if (!data.state) return 'State is required';
  if (!data.country) return 'Country is required';
  if (!data.durationOfLease) return 'Lease duration is required';
  return null;
};

