# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

npx hardhat --network localhost test
npx hardhat run --network test scripts/deploy.js
npx hardhat verify --contract "contracts/Factory.sol:Factory" --network test 0x27e39229fDDF06ac6697Bb4fdB634671F90fEa8A "0x3D60227114043cB2bC6b92f452DcBf670C173663" "0xE06deeE7516Dd4dcfb550FDc433Aac57Ac460bbd" "0xA91DCe2697cF51cd6fc873e7CFe7315fd52b6671" "0xA21d285B39C0eeF229DC598fb3f2F950F65060B8"
