const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");

function toWei(n) {
  return ethers.utils.parseEther(n);
}
function BnToString(n) {
  return ethers.utils.formatUnits(n, "ether");
}
async function etherBalance(addr) {
  return await ethers.provider.getBalance(addr);
}

function BnToString(n) {
  return ethers.utils.formatUnits(n, "ether");
}
function toBN(n) {
  return BigNumber.from(n);
}

describe("TetherToken", function () {

  let owner, tetherToken, NFTyacht, a1, a2, a3, a4, a5;

  it("deploy", async function () {
    [owner, charity, Marketing, Dev, Prize, a1, a2, a3, a4, a5] =
      await ethers.getSigners();

    const TetherToken = await ethers.getContractFactory("TetherToken");
    tetherToken = await TetherToken.deploy();
    await tetherToken.deployed();

    const NFTYacht = await ethers.getContractFactory("NFTYacht");
    NFTyacht = await NFTYacht.deploy(tetherToken.address);
    await NFTyacht.deployed();
  });

  it("balanceOf owner:", async () => {
    const bal = await tetherToken.connect(owner).balanceOf(owner.address);
    expect(BigNumber.from(bal).toString()).to.eq(toWei("1000"));
  });

  it("approve NFTyacht:", async () => {
    await tetherToken
      .connect(owner)
      .approve(NFTyacht.address, toWei("1000"));
  });

  it("buyOwnership:", async () => {
    await NFTyacht.connect(owner).buyOwnership(
      "Nabeel",
      "Nabeel@gamil.com",
      "111 111 1111",
      "11 11 1111",
      10,
      toWei("10")
    );
  });


});
