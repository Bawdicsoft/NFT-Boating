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

  // 0x0076e13F382458FA68B335e2a92c0ac981C179b4
  // 0x22bB41F0C2CCb90D0C5f7565ed054bd6b26ff8C6
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
