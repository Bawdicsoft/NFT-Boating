const hre = require("hardhat")
require("dotenv").config()

async function main() {
  // const Deploy = await hre.ethers.getContractFactory("Deploy")
  // const deploy = await Deploy.deploy()
  // await deploy.deployed()
  // console.log(deploy.address)
  // 0x98778C309A950e9e7F0b7A20940C799E5AFaD59b

  const Factory = await hre.ethers.getContractFactory("Factory")
  const factory = await Factory.deploy(
    "0x65C89088C691841D55263E74C7F5cD73Ae60186C",
    "0x98778C309A950e9e7F0b7A20940C799E5AFaD59b"
  )
  await factory.deployed()
  console.log(factory.address)
  // 0xa95e737Ede9624292EaC1FEEB985BD99EA7369ca
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
