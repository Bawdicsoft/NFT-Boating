const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;

function toWei(n) {
  return ethers.utils.parseUnits(n);
}

describe("nFTYacht", () => {
  let nFTYacht, tetherToken;
  let owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7;

  it("deploy smart contract", async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7] =
      await ethers.getSigners();

    const TetherToken = await ethers.getContractFactory("TetherToken");
    tetherToken = await TetherToken.deploy();
    await tetherToken.deployed();

    const NFTYacht = await ethers.getContractFactory("NFTYacht");
    nFTYacht = await NFTYacht.deploy(
      tetherToken.address,
      "ipfs://Qmb6UB5AtMgXzUyfz98StkFnNfa3Jesv9QnimojmRP4z6c/"
    );
    await nFTYacht.deployed();
  });

  it("approve:", async () => {
    await tetherToken.connect(owner).approve(nFTYacht.address, toWei("100"));
  });

  it("buyOwnership:", async () => {
    await nFTYacht.connect(owner).buyOwnership(1, toWei("1"));
  });
  it("buyOwnership:", async () => {
    await nFTYacht.connect(owner).buyOwnership(1, toWei("1"));
  });

  it("bookDate:", async () => {
    await nFTYacht.connect(owner).bookDate(2022, 7, 17, 1);
  });
  it("bookDate:", async () => {
    await nFTYacht.connect(owner).bookDate(2022, 7, 18, 2);
  });

  it("getAllBookedDates:", async () => {
    let newYear = await nFTYacht.connect(owner).newYear();
    let dates = await nFTYacht.connect(owner).getAllBookedDates(newYear);
    console.log("dates ", dates.toString());
  });

  it("cancelBooking:", async () => {
    await nFTYacht.connect(owner).cancelBooking(1);
  });

  it("getAllBookedDates:", async () => {
    let newYear = await nFTYacht.connect(owner).newYear();
    let dates = await nFTYacht.connect(owner).getAllBookedDates(newYear);
    console.log("dates ", dates.toString());
  });

  // it("add Property:", async () => {
  //   await realEstate.addProperty(
  //     toWei("100"),
  //     "Nabeel Nisar",
  //     "xyz",
  //     "123",
  //     "xyz",
  //     "xyz",
  //     "xyz",
  //     "xyz"
  //   );
  // });

  // it("is Pending For Sell:", async () => {
  //   expect(await realEstate.PendingForSell(1)).to.equal(true);
  // });

  // it("add Registry Authority:", async () => {
  //   await realEstate.connect(owner).addRegistryAuthority(addr1.address);
  // });

  // it("add Registry Authority:", async () => {
  //   await realEstate.connect(owner).addRegistryAuthority(addr2.address);
  // });

  // it("Decline Seller Request addr2:", async () => {
  //   await realEstate.connect(addr2).DeclineSellerRequest(1);
  // });

  // it("Accept Seller Request owner:", async () => {
  //   await realEstate.connect(owner).AcceptSellerRequest(1);
  // });

  // it("Accept Seller Request addr1:", async () => {
  //   await realEstate.connect(addr1).AcceptSellerRequest(1);
  // });

  // it("is Pending For Sell:", async () => {
  //   let isAcceptedForSell = await realEstate.isAcceptedForSell(1);
  //   // console.table(isAcceptedForSell);
  //   expect(isAcceptedForSell[0]).to.equal(true);
  //   expect(isAcceptedForSell[1]).to.equal(true);
  //   expect(isAcceptedForSell[3]).to.equal(undefined);
  // });

  // it("read properties Price:", async () => {
  //   let properties = await realEstate.properties(1);
  //   expect(properties.Price).to.equal(toWei("102"));
  // });

  // it("request For Buy Property:", async () => {
  //   await realEstate.requestForBuyProperty(
  //     1,
  //     "Atta",
  //     "xyz",
  //     "123",
  //     "xyz",
  //     "xyz",
  //     { value: toWei("102") }
  //   );
  // });

  // it("balance Of realEstate contract:", async () => {
  //   const balance0ETH = await provider.getBalance(realEstate.address);
  //   expect(balance0ETH).to.equal(toWei("102"));
  // });

  // it("is Pending For Buy:", async () => {
  //   expect(await realEstate.PendingforBuy(1)).to.equal(true);
  // });

  // it("balance Of contract:", async () => {
  //   expect(await realEstate.balanceOf(1)).to.equal(toWei("102"));
  // });

  // it("Decline Buyer Request addr2:", async () => {
  //   await realEstate.connect(addr2).DeclineBuyerRequest(1);
  // });

  // it("Accept Buyer Request owner:", async () => {
  //   await realEstate.connect(owner).AcceptBuyerRequest(1);
  // });

  // it("Accept Buyer Request addr1:", async () => {
  //   await realEstate.connect(addr1).AcceptBuyerRequest(1);
  // });

  // it("Buy Property:", async () => {
  //   await realEstate.BuyProperty(1);
  // });

  // it("balance Of realEstate contract:", async () => {
  //   const balance0ETH = await provider.getBalance(realEstate.address);
  //   expect(balance0ETH).to.equal(0);
  // });
});
