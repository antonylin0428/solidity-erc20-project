require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {},  // Local blockchain for testing
    // Sepolia testnet configuration
    // To deploy: 
    // 1. Create a .env file in the project root
    // 2. Add: SEPOLIA_URL=your_infura_or_alchemy_url
    // 3. Add: PRIVATE_KEY=your_metamask_private_key (starts with 0x)
    // 4. Run: npx hardhat ignition deploy ./ignition/modules/GovernedToken.js --network sepolia
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
