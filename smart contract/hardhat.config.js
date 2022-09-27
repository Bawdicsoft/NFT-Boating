require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.25",
      },
    ],
  },
  networks: {
    test: {
      url: process.env.URL,
      accounts: [process.env.PVT_KEY],
    },
    localhost: {
      url: "http://127.0.0.1:7545",
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
}
