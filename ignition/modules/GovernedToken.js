// Hardhat Ignition deployment module for GovernedToken
// Learn more at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GovernedTokenModule", (m) => {
    // Deploy GovernedToken contract
    // The constructor automatically mints 1,000,000 tokens to the deployer
    const governedToken = m.contract("GovernedToken");

    return { governedToken };
});

