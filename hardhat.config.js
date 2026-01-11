require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

console.log(process.env.SEPOLIA_URL);
console.log(process.env.PRIVATE_KEY);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 120000,
      gas: 2100000,
    }
  },
  ignition: {
    timeBeforeBumpingFees: 60000,
    maxFeeBumps: 3,
    requiredConfirmations: 1,
  }
};

