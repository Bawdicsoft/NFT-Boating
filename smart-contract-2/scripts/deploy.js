const hre = require("hardhat")
require("dotenv").config()

async function main() {
  const Deploy = await hre.ethers.getContractFactory("Deploy")
  const deploy = await Deploy.deploy()
  await deploy.deployed()
  console.log(deploy.address)

  const Factory = await hre.ethers.getContractFactory("Factory")
  const factory = await Factory.deploy(
    "0x305007FF14723C49Dd383C7A4B048DBFc68EC8c4",
    "0x4F1dD51C625E9c36CB71c8bB77C375a0100767B2",
    "0x5b761c98D5fdbc4ADE93B328e923E5d02B9E5468",
    deploy.address
  )
  await factory.deployed()
  console.log(factory.address)

  // Deploy 0x3f816b313e005E5bBB7EADeC234eB1EA669adcf1
  // Factory 0xFcd2030Ff1EBeD9f25e743EAdD5e1d73176690a5
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
