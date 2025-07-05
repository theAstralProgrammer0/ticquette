const { ethers, network } = require("hardhat"); // Import 'network' for hre.network.name if not already

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Correct way to get the balance using the provider associated with the signer
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", balance.toString());

  const TicquetteNFT = await ethers.getContractFactory("TicquetteNFT");
  const ticquetteNFT = await TicquetteNFT.deploy(deployer.address);

  await ticquetteNFT.waitForDeployment(); // Use waitForDeployment() instead of deployed() for newer Hardhat/Ethers versions

  console.log("TicquetteNFT deployed to:", ticquetteNFT.target); // Use .target for the address
  console.log("Owner:", await ticquetteNFT.owner());

  // Save deployment info
  const deploymentInfo = {
    contractAddress: ticquetteNFT.target, // Use .target for the address
    owner: deployer.address,
    network: network.name, // Use 'network.name' directly
    deployedAt: new Date().toISOString()
  };

  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

