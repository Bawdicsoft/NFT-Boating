const hre = require("hardhat")
require("dotenv").config()

async function main() {
  const Deploy = await hre.ethers.getContractFactory("Deploy")
  const deploy = await Deploy.deploy()
  await deploy.deployed()
  console.log(deploy.address)

  // const Factory = await hre.ethers.getContractFactory("Factory")
  // const factory = await Factory.deploy(
  //   "0x65C89088C691841D55263E74C7F5cD73Ae60186C",
  //   "0x0d1899b64f7257f92b4370836e96bfb73b5c5214"
  // )
  // await factory.deployed()
  // console.log(factory.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
