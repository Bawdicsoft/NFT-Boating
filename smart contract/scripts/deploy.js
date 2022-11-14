const hre = require("hardhat")
require("dotenv").config()

async function main() {
  const Deploy = await hre.ethers.getContractFactory("Deploy")
  const deploy = await Deploy.deploy()
  await deploy.deployed()
  console.log("Deploy", deploy.address)

  const Factory = await hre.ethers.getContractFactory("Factory")
  const factory = await Factory.deploy(
    "0x163015e24dac806b7ba423f1b70314c8f3a4aa43",
    "0x1075c16ab05c9D814d40Fc18be5169da00f8253C",
    "0x7Ea1AF6046deA9c8f08e21F20E8BC4A2DA6ee3BD",
    deploy.address
  )
  await factory.deployed()
  console.log("Factory", factory.address)

  // Deploy 0x399b7737FF03EaA74E6566c5D09F2B0095Db2290
  // Factory 0x87Ec9178d7Adf2A21dbE4ed3800478Eaa0E5BC3D

  // sepolia
  // Deploy 0x90a3AdA0FFB64a58fCcAD6b1F3191d1aE8FE6675
  // Factory 0xcE5E2c3B4086d1aABd2d858d2f2109EA848a968C
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
