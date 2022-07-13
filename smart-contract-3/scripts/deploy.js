const hre = require("hardhat");

async function main() {
  const TetherToken = await hre.ethers.getContractFactory("TetherToken");
  const tetherToken = await TetherToken.deploy();
  await tetherToken.deployed();

  const NFTYacht = await hre.ethers.getContractFactory("NFTYacht");
  const nFTYacht = await NFTYacht.deploy(
    tetherToken.address,
    "ipfs://Qmb6UB5AtMgXzUyfz98StkFnNfa3Jesv9QnimojmRP4z6c/"
  );
  await nFTYacht.deployed();

  console.log(nFTYacht.address, tetherToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
