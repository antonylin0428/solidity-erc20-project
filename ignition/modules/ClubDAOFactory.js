const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

/**
 * Deployment module for ClubDAOFactory
 * 
 * This module deploys the ClubDAOFactory contract, which is the main entry point
 * for creating new club organizations.
 * 
 * When deployed, users can call createOrganization() to set up new clubs.
 */
module.exports = buildModule("ClubDAOFactoryModule", (m) => {
  // Deploy the factory contract
  // This is the only contract that needs to be deployed manually
  // All other contracts (NFTs, DAOs) are created by calling the factory
  const clubDAOFactory = m.contract("ClubDAOFactory");

  return { clubDAOFactory };
});

