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

    describe("Proposal Creation", function () {
        it("Should create a proposal and return proposal ID 1", async function () {
            const tx = await token.createProposal("Increase token supply by 10%");
            const receipt = await tx.wait();

            expect(await token.proposalCount()).to.equal(1);

            const proposal = await token.proposalsById(1);
            expect(proposal.description).to.equal("Increase token supply by 10%");
            expect(proposal.votesFor).to.equal(0);
            expect(proposal.votesAgainst).to.equal(0);
            expect(proposal.executed).to.equal(false);
        });

        it("Should create multiple proposals with sequential IDs", async function () {
            await token.createProposal("Proposal 1");
            await token.createProposal("Proposal 2");
            await token.createProposal("Proposal 3");

            expect(await token.proposalCount()).to.equal(3);

            const proposal1 = await token.proposalsById(1);
            const proposal2 = await token.proposalsById(2);
            const proposal3 = await token.proposalsById(3);

            expect(proposal1.description).to.equal("Proposal 1");
            expect(proposal2.description).to.equal("Proposal 2");
            expect(proposal3.description).to.equal("Proposal 3");
        });
    });

    describe("Voting", function () {
        let voter1, voter2;

        beforeEach(async function () {
            [deployer, voter1, voter2] = await ethers.getSigners();

            // Create a proposal for voting tests
            await token.createProposal("Test proposal for voting");

            // Transfer some tokens to voters for testing
            const transferAmount = ethers.parseUnits("100000", 18); // 100k tokens
            await token.transfer(voter1.address, transferAmount);
            await token.transfer(voter2.address, transferAmount);
        });

        it("Should allow voting 'for' a proposal", async function () {
            const voter1Balance = await token.balanceOf(voter1.address);

            await token.connect(voter1).vote(1, true);

            const proposal = await token.proposalsById(1);
            expect(proposal.votesFor).to.equal(voter1Balance);
            expect(proposal.votesAgainst).to.equal(0);
            expect(await token.hasVoted(1, voter1.address)).to.equal(true);
        });

        it("Should allow voting 'against' a proposal", async function () {
            const voter1Balance = await token.balanceOf(voter1.address);

            await token.connect(voter1).vote(1, false);

            const proposal = await token.proposalsById(1);
            expect(proposal.votesFor).to.equal(0);
            expect(proposal.votesAgainst).to.equal(voter1Balance);
            expect(await token.hasVoted(1, voter1.address)).to.equal(true);
        });

        it("Should weight votes by token balance", async function () {
            // Voter1 has 100k tokens, voter2 has 100k tokens
            const voter1Balance = await token.balanceOf(voter1.address);
            const voter2Balance = await token.balanceOf(voter2.address);

            await token.connect(voter1).vote(1, true);
            await token.connect(voter2).vote(1, false);

            const proposal = await token.proposalsById(1);
            expect(proposal.votesFor).to.equal(voter1Balance);
            expect(proposal.votesAgainst).to.equal(voter2Balance);
        });

        it("Should prevent voting twice on the same proposal", async function () {
            await token.connect(voter1).vote(1, true);

            await expect(
                token.connect(voter1).vote(1, false)
            ).to.be.revertedWith("Already voted on this proposal");
        });

        it("Should prevent voting on non-existent proposals", async function () {
            await expect(
                token.connect(voter1).vote(999, true)
            ).to.be.revertedWith("Proposal does not exist");
        });

        it("Should prevent voting without tokens", async function () {
            const [deployer, voter1, voter2, noTokens] = await ethers.getSigners();

            await expect(
                token.connect(noTokens).vote(1, true)
            ).to.be.revertedWith("Must own tokens to vote");
        });
    });
});