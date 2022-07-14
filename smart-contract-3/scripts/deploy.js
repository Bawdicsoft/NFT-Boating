const hre = require("hardhat");

async function main() {
  // const TetherToken = await hre.ethers.getContractFactory("TetherToken");
  // const tetherToken = await TetherToken.deploy();
  // await tetherToken.deployed();

  const NFTYacht = await hre.ethers.getContractFactory("NFTYacht");
  const nFTYacht = await NFTYacht.deploy(
    "0x3cDDe7A730A552897425D3d79CF773B3f711C3C1",
    "ipfs://Qmb6UB5AtMgXzUyfz98StkFnNfa3Jesv9QnimojmRP4z6c/"
  );
  await nFTYacht.deployed();

  console.log(nFTYacht.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
