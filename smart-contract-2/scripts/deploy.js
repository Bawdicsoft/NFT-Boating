const hre = require("hardhat")
require("dotenv").config()

async function main() {
  const Deploy = await hre.ethers.getContractFactory("Deploy")
  const deploy = await Deploy.deploy()
  await deploy.deployed()
  console.log(deploy.address)

  const Factory = await hre.ethers.getContractFactory("Factory")
  const factory = await Factory.deploy(
    "0xc8604af17cb5481ef010b67aa32d4621dc319247",
    deploy.address
  )
  await factory.deployed()
  console.log(factory.address)

  // 0x6d9807cF73d57c23b1aBECA4aeF01f2300fE095f
  // 0x4e623C7a27580D3BE7D309AEcb3A10Fe305a4445
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
