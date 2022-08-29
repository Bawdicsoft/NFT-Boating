const hre = require("hardhat")
require("dotenv").config()

async function main() {
  const Deploy = await hre.ethers.getContractFactory("Deploy")
  const deploy = await Deploy.deploy()
  await deploy.deployed()
  console.log(deploy.address)

  const Factory = await hre.ethers.getContractFactory("Factory")
  const factory = await Factory.deploy(
    "0x3D60227114043cB2bC6b92f452DcBf670C173663",
    "0xE06deeE7516Dd4dcfb550FDc433Aac57Ac460bbd",
    "0xA91DCe2697cF51cd6fc873e7CFe7315fd52b6671",
    deploy.address
  )
  await factory.deployed()
  console.log(factory.address)

  // 0xA21d285B39C0eeF229DC598fb3f2F950F65060B8
  // 0x27e39229fDDF06ac6697Bb4fdB634671F90fEa8A
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
