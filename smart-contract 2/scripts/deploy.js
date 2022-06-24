// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const TetherToken = await hre.ethers.getContractFactory("TetherToken");
  const tetherToken = await TetherToken.deploy();
  await tetherToken.deployed();

  console.log("tetherToken deployed to:", tetherToken.address);

  // const NFTYacht = await hre.ethers.getContractFactory("NFTYacht");
  // const nftYacht = await NFTYacht.deploy(tetherToken.address);
  // await nftYacht.deployed();

  // console.log("nftYacht deployed to:", nftYacht.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



// DEPLOYMENT LINKS

// tetherToken deployed to: 0x4A2E23c38AE796E65968471d7e43523C878dcD23

// tetherToken deployed to: 0xee26B0F49E2170dc755ca094d0a5637924df63C2
// nftYacht deployed to: 0xc452832aBd994c332087d526BF7deeC38EA44baA
