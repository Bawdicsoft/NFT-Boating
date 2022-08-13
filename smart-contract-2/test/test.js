const { expect } = require("chai")
const { ethers, waffle } = require("hardhat")
const provider = waffle.provider

function toWei(n) {
  return ethers.utils.parseUnits(n)
}

describe("nFTYacht", () => {
  let nFTYacht, tetherToken, deploy, factory
  let owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7

  it("deploy smart contract", async function () {
    ;[owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7] =
      await ethers.getSigners()

    const TetherToken = await ethers.getContractFactory("TetherToken")
    tetherToken = await TetherToken.deploy(
      "10000000000000000000000000",
      "TetherToken",
      "USDT",
      6
    )
    await tetherToken.deployed()

    const Deploy = await hre.ethers.getContractFactory("Deploy")
    deploy = await Deploy.deploy()
    await deploy.deployed()

    const Factory = await hre.ethers.getContractFactory("Factory")
    factory = await Factory.deploy(tetherToken.address, deploy.address)
    await factory.deployed()

    await deploy.connect(owner).updateFactoryAddress(factory.address)

    await tetherToken
      .connect(owner)
      .transfer(addr1.address, "100000000000000000")
  })

  it("addAddressToWhitelist:", async () => {
    await deploy.connect(owner).addAddressToWhitelist(owner.address)
  })

  it("deploy:", async () => {
    await deploy
      .connect(owner)
      .deploy("name", "n", 365, 5000, owner.address, "xxxxxxxxxxxxxxxxxx")
  })

  let allContractAddress
  it("allContractAddress:", async () => {
    allContractAddress = await deploy.connect(owner).allContractAddress()
    // console.log("allContractAddress", allContractAddress)
  })

  let contractDitals
  it("contractDitals:", async () => {
    contractDitals = await deploy
      .connect(owner)
      .contractDitals(allContractAddress[0])
    console.log("allContractAddress", contractDitals.price.toString())
  })

  it("specialDayAmount:", async () => {
    const amount = await factory
      .connect(owner)
      .specialDayAmount(2022, 8, 15, allContractAddress[0])
    console.log(amount, "specialDayAmount")
  })

  it("addSpecialDay:", async () => {
    await factory
      .connect(owner)
      .addSpecialDay(2022, 8, 15, 100, allContractAddress[0])
  })

  it("specialDayAmount:", async () => {
    const amount = await factory
      .connect(owner)
      .specialDayAmount(2022, 8, 15, allContractAddress[0])
    console.log(amount, "specialDayAmount")
  })

  it("approve:", async () => {
    await tetherToken
      .connect(owner)
      .approve(factory.address, contractDitals.price.toString())
  })

  it("buyOwnership owner:", async () => {
    await factory
      .connect(owner)
      .buyOwnership(1, contractDitals.price.toString(), allContractAddress[0])
  })

  it("approve:", async () => {
    await tetherToken
      .connect(addr1)
      .approve(factory.address, contractDitals.price.toString())
  })

  it("buyOwnership addr1:", async () => {
    await factory
      .connect(addr1)
      .buyOwnership(1, contractDitals.price.toString(), allContractAddress[0])
  })

  let ownerID
  it("ownerIDs:", async () => {
    ownerID = await factory
      .connect(owner)
      .UserIDs(allContractAddress[0], owner.address)
    console.log(ownerID.toString())
  })

  it("approve:", async () => {
    await tetherToken.connect(owner).approve(factory.address, 100)
  })

  it("bookDate owner:", async () => {
    await factory
      .connect(owner)
      .bookDate(2022, 8, 15, allContractAddress[0], ownerID.toString(), 100)
  })

  it("allBookedDates:", async () => {
    let _newYear = await factory.connect(owner)._newYear()
    let allBookedDates = await factory
      .connect(owner)
      .allBookedDates(allContractAddress[0], _newYear)
    console.log(allBookedDates)
  })

  let _offerPrice
  it("_offerPrice:", async () => {
    _offerPrice = await factory.connect(addr1)._offerPrice()
  })
  it("approve:", async () => {
    await tetherToken
      .connect(addr1)
      .approve(factory.address, 100 + Number(_offerPrice.toString()))
  })
  it("offer:", async () => {
    await factory
      .connect(addr1)
      .offer(
        allContractAddress[0],
        ownerID.toString(),
        2,
        100 + Number(_offerPrice.toString())
      )
  })

  it("withdrewSpecialDayAmount:", async () => {
    await factory
      .connect(owner)
      .withdrewSpecialDayAmount(2022, 8, 15, allContractAddress[0])
  })

  it("cancelBooking:", async () => {
    await factory
      .connect(owner)
      .cancelBooking(allContractAddress[0], ownerID.toString())
  })

  it("allBookedDates:", async () => {
    let _newYear = await factory.connect(owner)._newYear()
    let allBookedDates = await factory
      .connect(owner)
      .allBookedDates(allContractAddress[0], _newYear)
    console.log(allBookedDates)
  })

  // it("buyOwnership:", async () => {
  //   await nFTYacht.connect(owner).buyOwnership(1, toWei("1"))
  // })

  // it("bookDate:", async () => {
  //   await nFTYacht.connect(owner).bookDate(2022, 7, 17, 1)
  // })
  // it("bookDate:", async () => {
  //   await nFTYacht.connect(owner).bookDate(2022, 7, 18, 2)
  // })

  // it("getAllBookedDates:", async () => {
  //   let newYear = await nFTYacht.connect(owner).newYear()
  //   let dates = await nFTYacht.connect(owner).getAllBookedDates(newYear)
  //   console.log("dates ", dates.toString())
  // })

  // it("cancelBooking:", async () => {
  //   await nFTYacht.connect(owner).cancelBooking(1)
  // })

  // it("getAllBookedDates:", async () => {
  //   let newYear = await nFTYacht.connect(owner).newYear()
  //   let dates = await nFTYacht.connect(owner).getAllBookedDates(newYear)
  //   console.log("dates ", dates.toString())
  // })

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
})
