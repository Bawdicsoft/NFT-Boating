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

  // 0x80C722d0535bd81D92ddeaBd624f2d9436d75c9a
  // 0x8548E2B75f3d6E3493CB0eFf80Fc47cEC2387Cc1
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
