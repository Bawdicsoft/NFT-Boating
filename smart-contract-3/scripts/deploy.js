const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // const TetherToken = await hre.ethers.getContractFactory("TetherToken");
  // const tetherToken = await TetherToken.deploy();
  // await tetherToken.deployed();

  // const NFTYacht = await hre.ethers.getContractFactory("NFTYacht");
  // const nFTYacht = await NFTYacht.deploy(
  //   "name",
  //   "n",
  //   "360",
  //   "1000000000000",
  //   process.env.acc,
  //   "ipfs://Qmb6UB5AtMgXzUyfz98StkFnNfa3Jesv9QnimojmRP4z6c/"
  // );
  // await nFTYacht.deployed();

  const Factory = await hre.ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();
  await factory.deployed();

  console.log(factory.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
