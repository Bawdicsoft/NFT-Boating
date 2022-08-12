const hre = require("hardhat");

async function main() {

  // We get the contract to deploy
  const TetherToken = await hre.ethers.getContractFactory("TetherToken");
  const tetherToken = await TetherToken.deploy();
  await tetherToken.deployed();

  const NFTYacht = await hre.ethers.getContractFactory("NFTYacht");
  const nftYacht = await NFTYacht.deploy(
    "0x03c901a1d894f8b6A7eFeF71E47fBA6aC776EB6d"
  );
  await nftYacht.deployed();

  console.log("tetherToken deployed to:", tetherToken.address);
  console.log("nftYacht deployed to:", nftYacht.address);

  // tetherToken deployed to: 0x00DF9E7FaF573Cb41f050e3a43fCF813Ce0609c2
  // nftYacht deployed to: 0xf6396Ac2d3126567f618F443fFA806EB082Bb935

  // tetherToken deployed to: 0x03c901a1d894f8b6A7eFeF71E47fBA6aC776EB6d
  // nftYacht deployed to: 0xe825314959493e2942162E0846a46E5A244fa222}
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

