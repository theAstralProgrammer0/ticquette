const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const TicquetteNFT = await ethers.getContractFactory("TicquetteNFT");
  const ticquetteNFT = await TicquetteNFT.deploy(deployer.address);

  await ticquetteNFT.deployed();

  console.log("TicquetteNFT deployed to:", ticquetteNFT.address);
  console.log("Owner:", await ticquetteNFT.owner());

  // Save deployment info
  const deploymentInfo = {
    contractAddress: ticquetteNFT.address,
    owner: deployer.address,
    network: hre.network.name,
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

