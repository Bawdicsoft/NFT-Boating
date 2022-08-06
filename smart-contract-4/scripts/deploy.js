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

  // 0xf92e968F5922B78374Ab1a06E1eB7d7Aba7751C7
  // 0x0C52a72317260B4495792FddF08740798d5c0826
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
