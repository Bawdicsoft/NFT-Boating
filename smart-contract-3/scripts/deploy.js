const hre = require("hardhat");

async function main() {
  // const TetherToken = await hre.ethers.getContractFactory("TetherToken");
  // const tetherToken = await TetherToken.deploy();
  // await tetherToken.deployed();

  const NFTYacht = await hre.ethers.getContractFactory("NFTYacht");
  const nFTYacht = await NFTYacht.deploy(
    "0x921e00B13562F4C3f4B677f6CaD7639562595c33"
  );
  await nFTYacht.deployed();

  console.log(nFTYacht.address);

  // 0x07B922cF27D4c51E42dE9a87f8F021a719402b66 0x4F5d97CF9B3Ae95AcD2e10dB43eDfC9F453227CC

  // 0x921e00B13562F4C3f4B677f6CaD7639562595c33 0xc0A259D6BC7a47FBfD9adA05EbDcD062C7b3747a

  // 0x6fc8e5BBcE69574FF28276EF0eA9e45Ec0ee3894

  // 0x24c19a47a8ce3e8e674021c7c0c930090d8d436b

  // 0x26e3e87873265237172194E7418a20Df204Fbb7D

  // 0x0Ed9A23dF7f01CA7D0C19bE4Dd59c5B2c25F670c
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
