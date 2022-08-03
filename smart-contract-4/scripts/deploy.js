const hre = require("hardhat")
require("dotenv").config()

async function main() {
  const Deploy = await hre.ethers.getContractFactory("Deploy")
  const deploy = await Deploy.deploy()
  await deploy.deployed()
  console.log(deploy.address)

  const Factory = await hre.ethers.getContractFactory("Factory")
  const factory = await Factory.deploy(
    "0x65C89088C691841D55263E74C7F5cD73Ae60186C",
    deploy.address
  )
  await factory.deployed()
  console.log(factory.address)

  // 0x1C43fd747b973089Ba7747Ec5F116f38c86BCc9f
  // 0x49aaD763dA7A1e07c0B7a0880527D7f915fe5579
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
