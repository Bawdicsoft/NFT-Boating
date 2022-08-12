const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftBoating", function () {
  let owner,
    a1,
    a2,
    a3,
    a4,
    a5;
  it("Should return the new greeting once it's changed", async function () {

    [owner, a1, a2, a2, a4, a5] =
        await ethers.getSigners();

    const TetherToken = await ethers.getContractFactory("TetherToken");
    const tetherToken = await TetherToken.deploy("10000000", "khan", "kh", "6");
    await tetherToken.deployed();
    
    const NftBoating = await ethers.getContractFactory("NftBoating");
    const nftBoating = await NftBoating.deploy(tetherToken.address);
    await nftBoating.deployed();

    await tetherToken.approve(nftBoating.address, "10000");
    await tetherToken.allowance(nftBoating.address, "10000");
    await nftBoating.buyToken("kahn", "khan@gmail.com", "0332", "12-12-1990", 10 );
  });
});
