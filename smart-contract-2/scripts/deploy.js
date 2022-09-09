const hre = require("hardhat")
require("dotenv").config()

async function main() {
  const Deploy = await hre.ethers.getContractFactory("Deploy")
  const deploy = await Deploy.deploy()
  await deploy.deployed()
  console.log(deploy.address)

  const Factory = await hre.ethers.getContractFactory("Factory")
  const factory = await Factory.deploy(
    "0x3f3B1a663F659fb85158cf4242d1e23e236F47B6",
    "0x9b59a220157f408156d8C344A84F26410D2EE738",
    "0x329306e74036CB4Cbb232E8E3E15A301e1098516",
    deploy.address
  )
  await factory.deployed()
  console.log(factory.address)

  // Deploy 0x081269944DCBbf6744C38A44687909830CCde51A
  // Factory 0x1Ffe832F1756B9e4Faa09F987E9D1A1cE825b76c
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
