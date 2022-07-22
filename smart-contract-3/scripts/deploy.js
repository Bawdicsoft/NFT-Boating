const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // const TetherToken = await hre.ethers.getContractFactory("TetherToken");
  // const tetherToken = await TetherToken.deploy();
  // await tetherToken.deployed();
  // 0x65C89088C691841D55263E74C7F5cD73Ae60186C

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
  // 0x4A309BB74778E2aE1259B5e91588a268E1083DEb

  console.log(factory.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
