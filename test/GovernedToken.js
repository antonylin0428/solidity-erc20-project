const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GovernedToken", function () {
    let GovernedToken;
    let token;
    let deployer;

    beforeEach(async function () {
        [deployer] = await ethers.getSigners();
        GovernedToken = await ethers.getContractFactory("GovernedToken");
        token = await GovernedToken.deploy();
        await token.waitForDeployment();
    });

    it("Should deploy the GovernedToken contract", async function () {
        expect(await token.getAddress()).to.properAddress;
    });

    it("Should mint 1,000,000 tokens to the deployer", async function () {
        const balance = await token.balanceOf(deployer.address);
        expect(balance).to.equal(ethers.parseUnits("1000000", 18));
    });

    it("Should have the correct token name", async function () {
        expect(await token.name()).to.equal("GovernedToken");
    });

    it("Should have the correct token symbol", async function () {
        expect(await token.symbol()).to.equal("GOV");
    });
});