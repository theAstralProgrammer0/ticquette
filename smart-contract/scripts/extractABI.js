import fs from 'fs';

const artifactPath = './artifacts/contracts/TicquetteNFT.sol/TicquetteNFT.json';
const outputPath = './abi/TicquetteNFT.json';

const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
fs.mkdirSync('./abi', { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(artifact.abi, null, 2));

console.log(`✅ ABI extracted to ${outputPath}`);

