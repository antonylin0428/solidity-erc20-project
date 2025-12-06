require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {},  // Local blockchain for testing
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",  // Get a free key at infura.io
      accounts: ["YOUR_METAMASK_PRIVATE_KEY"]  // Export from MetaMask (be careful, never commit this!)
    }
  }
};
