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


// 0xe5e9B33EcAbB40469eD34220110D3E1E0aa0Ffe0
// 0x14f94e170BfeE7a274d3B3ED07B361f67D46A1A4
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
