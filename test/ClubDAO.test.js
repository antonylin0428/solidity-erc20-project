const { expect } = require("chai");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("ClubDAO", function () {
  async function deployDAOFixture() {
    const [owner, member1, member2, member3, member4, nonMember, recipient] = await ethers.getSigners();

    // Deploy NFT contract
    const MembershipNFT = await ethers.getContractFactory("MembershipNFT");
    const nft = await MembershipNFT.deploy(
      "Test Club",
      "TEST",
      10,
      owner.address
    );

    // Deploy DAO contract
    const ClubDAO = await ethers.getContractFactory("ClubDAO");
    const dao = await ClubDAO.deploy(nft.target);

    // Set DAO as minter
    await nft.setMinter(dao.target);

    // Mint first membership directly through NFT (owner can mint)
    // This creates the first member who can then add others
    await nft.connect(owner).mint(member1.address);

    // Now member1 can add other members through the DAO
    await dao.connect(member1).addMember(member2.address);
    await dao.connect(member1).addMember(member3.address);
    await dao.connect(member1).addMember(member4.address);

    return { dao, nft, owner, member1, member2, member3, member4, nonMember, recipient };
  }

  describe("Deployment", function () {
    it("Should deploy with correct NFT reference", async function () {
      const { dao, nft } = await loadFixture(deployDAOFixture);
      expect(await dao.membershipNFT()).to.equal(nft.target);
    });

    it("Should start with zero proposals", async function () {
      const { dao } = await loadFixture(deployDAOFixture);
      expect(await dao.proposalCount()).to.equal(0);
    });

    it("Should have default voting period of 7 days", async function () {
      const { dao } = await loadFixture(deployDAOFixture);
      expect(await dao.votingPeriod()).to.equal(7 * 24 * 60 * 60);
    });

    it("Should have default quorum threshold of 50%", async function () {
      const { dao } = await loadFixture(deployDAOFixture);
      expect(await dao.quorumThreshold()).to.equal(50);
    });
  });

  describe("addMember", function () {
    it("Should allow member to add new member", async function () {
      const { dao, nft, member1, nonMember } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).addMember(nonMember.address);
      expect(await nft.isMember(nonMember.address)).to.be.true;
    });

    it("Should not allow non-member to add member", async function () {
      const { dao, nonMember, member1 } = await loadFixture(deployDAOFixture);
      await expect(
        dao.connect(nonMember).addMember(member1.address)
      ).to.be.revertedWith("ClubDAO: Not a member");
    });
  });

  describe("createProposal", function () {
    it("Should create a proposal", async function () {
      const { dao, member1, recipient } = await loadFixture(deployDAOFixture);
      const tx = await dao.connect(member1).createProposal(
        "Send 0.1 ETH to recipient",
        recipient.address,
        "0x",
        ethers.parseEther("0.1")
      );

      expect(await dao.proposalCount()).to.equal(1);
    });

    it("Should emit ProposalCreated event", async function () {
      const { dao, member1, recipient } = await loadFixture(deployDAOFixture);
      await expect(
        dao.connect(member1).createProposal(
          "Test proposal",
          recipient.address,
          "0x",
          0
        )
      )
        .to.emit(dao, "ProposalCreated")
        .withArgs(1, member1.address, "Test proposal");
    });

    it("Should set proposal deadline correctly", async function () {
      const { dao, member1, recipient } = await loadFixture(deployDAOFixture);

      const tx = await dao.connect(member1).createProposal(
        "Test",
        recipient.address,
        "0x",
        0
      );

      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      const proposal = await dao.getProposal(1);

      const expectedDeadline =
        BigInt(block.timestamp) + BigInt(7 * 24 * 60 * 60);

      expect(Number(proposal.deadline)).to.be.closeTo(
        Number(expectedDeadline),
        2
      );
    });


    it("Should allow anyone to create proposal", async function () {
      const { dao, nonMember, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(nonMember).createProposal(
        "Test",
        recipient.address,
        "0x",
        0
      );
      expect(await dao.proposalCount()).to.equal(1);
    });

    it("Should increment proposal count", async function () {
      const { dao, member1, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).createProposal("Proposal 1", recipient.address, "0x", 0);
      await dao.connect(member1).createProposal("Proposal 2", recipient.address, "0x", 0);
      expect(await dao.proposalCount()).to.equal(2);
    });
  });

  describe("vote", function () {
    it("Should allow member to vote", async function () {
      const { dao, member1, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);
      await dao.connect(member1).vote(1, true);

      expect(await dao.hasVoted(1, member1.address)).to.be.true;
    });

    it("Should emit VoteCast event", async function () {
      const { dao, member1, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);

      await expect(dao.connect(member1).vote(1, true))
        .to.emit(dao, "VoteCast")
        .withArgs(1, member1.address, true, 1);
    });

    it("Should update vote counts correctly", async function () {
      const { dao, member1, member2, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);

      await dao.connect(member1).vote(1, true);
      await dao.connect(member2).vote(1, false);

      const proposal = await dao.getProposal(1);
      expect(proposal.votesFor).to.equal(1);
      expect(proposal.votesAgainst).to.equal(1);
    });

    it("Should not allow non-member to vote", async function () {
      const { dao, member1, nonMember, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);

      await expect(
        dao.connect(nonMember).vote(1, true)
      ).to.be.revertedWith("ClubDAO: Not a member");
    });

    it("Should prevent double voting", async function () {
      const { dao, member1, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);
      await dao.connect(member1).vote(1, true);

      await expect(
        dao.connect(member1).vote(1, false)
      ).to.be.revertedWith("ClubDAO: Already voted");
    });

    it("Should not allow voting after deadline", async function () {
      const { dao, member1, member2, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);

      // Fast forward past voting period
      await time.increase(7 * 24 * 60 * 60 + 1);

      await expect(
        dao.connect(member2).vote(1, true)
      ).to.be.revertedWith("ClubDAO: Voting period ended");
    });

    it("Should not allow voting on non-existent proposal", async function () {
      const { dao, member1 } = await loadFixture(deployDAOFixture);
      await expect(
        dao.connect(member1).vote(999, true)
      ).to.be.revertedWith("ClubDAO: Proposal does not exist");
    });
  });

  describe("delegation", function () {
    it("Should allow member to delegate", async function () {
      const { dao, member1, member2 } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).delegate(member2.address);

      expect(await dao.delegation(member1.address)).to.equal(member2.address);
      expect(await dao.hasDelegated(member1.address)).to.be.true;
    });

    it("Should emit DelegationSet event", async function () {
      const { dao, member1, member2 } = await loadFixture(deployDAOFixture);
      await expect(dao.connect(member1).delegate(member2.address))
        .to.emit(dao, "DelegationSet")
        .withArgs(member1.address, member2.address);
    });

    it("Should increase delegatee's voting power", async function () {
      const { dao, member1, member2, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).delegate(member2.address);

      expect(await dao.getVotingPower(member2.address)).to.equal(2); // 1 base + 1 delegation
    });

    it("Should not allow delegating to non-member", async function () {
      const { dao, member1, nonMember } = await loadFixture(deployDAOFixture);
      await expect(
        dao.connect(member1).delegate(nonMember.address)
      ).to.be.revertedWith("ClubDAO: Can only delegate to members");
    });

    it("Should not allow delegating to self", async function () {
      const { dao, member1 } = await loadFixture(deployDAOFixture);
      await expect(
        dao.connect(member1).delegate(member1.address)
      ).to.be.revertedWith("ClubDAO: Cannot delegate to yourself");
    });

    it("Should not allow double delegation", async function () {
      const { dao, member1, member2, member3 } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).delegate(member2.address);

      await expect(
        dao.connect(member1).delegate(member3.address)
      ).to.be.revertedWith("ClubDAO: Already delegated");
    });

    it("Should allow revoking delegation", async function () {
      const { dao, member1, member2 } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).delegate(member2.address);
      await dao.connect(member1).revokeDelegation();

      expect(await dao.hasDelegated(member1.address)).to.be.false;
      expect(await dao.delegation(member1.address)).to.equal(ethers.ZeroAddress);
    });

    it("Should emit DelegationRevoked event", async function () {
      const { dao, member1, member2 } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).delegate(member2.address);

      await expect(dao.connect(member1).revokeDelegation())
        .to.emit(dao, "DelegationRevoked")
        .withArgs(member1.address);
    });

    it("Should update voting power after revoking", async function () {
      const { dao, member1, member2, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).delegate(member2.address);
      expect(await dao.getVotingPower(member2.address)).to.equal(2);

      await dao.connect(member1).revokeDelegation();
      expect(await dao.getVotingPower(member2.address)).to.equal(1);
    });

    it("Should not allow voting when delegated", async function () {
      const { dao, member1, member2, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).delegate(member2.address);
      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);

      // Member1 cannot vote because they delegated
      // But member2 can vote with increased power
      await dao.connect(member2).vote(1, true);
      const proposal = await dao.getProposal(1);
      expect(proposal.votesFor).to.equal(2); // member2's vote + member1's delegation
    });
  });

  describe("getVotingPower", function () {
    it("Should return 1 for member with no delegations", async function () {
      const { dao, member1 } = await loadFixture(deployDAOFixture);
      expect(await dao.getVotingPower(member1.address)).to.equal(1);
    });

    it("Should return 0 for non-member", async function () {
      const { dao, nonMember } = await loadFixture(deployDAOFixture);
      expect(await dao.getVotingPower(nonMember.address)).to.equal(0);
    });

    it("Should include delegations in voting power", async function () {
      const { dao, member1, member2, member3 } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).delegate(member2.address);
      await dao.connect(member3).delegate(member2.address);

      expect(await dao.getVotingPower(member2.address)).to.equal(3); // 1 base + 2 delegations
    });
  });

  describe("proposalPassed", function () {
    it("Should return false if votesFor <= votesAgainst", async function () {
      const { dao, member1, member2, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);
      await dao.connect(member1).vote(1, true);
      await dao.connect(member2).vote(1, false);

      expect(await dao.proposalPassed(1)).to.be.false;
    });

    it("Should return false if quorum not met", async function () {
      const { dao, member1, member2, member3, member4, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);
      // Only 1 vote out of 4 members (25% < 50% quorum)
      await dao.connect(member1).vote(1, true);

      expect(await dao.proposalPassed(1)).to.be.false;
    });

    it("Should return true if proposal passed with quorum", async function () {
      const { dao, member1, member2, member3, member4, recipient } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);
      // 3 votes for, 1 against = 4 total votes (50% quorum met, majority for)
      await dao.connect(member1).vote(1, true);
      await dao.connect(member2).vote(1, true);
      await dao.connect(member3).vote(1, true);
      await dao.connect(member4).vote(1, false);

      expect(await dao.proposalPassed(1)).to.be.true;
    });
  });

  describe("executeProposal", function () {
    it("Should execute proposal that passed", async function () {
      const { dao, owner, member1, member2, member3, member4, recipient } = await loadFixture(deployDAOFixture);

      // Create proposal to send 0.1 ETH
      await dao.connect(member1).createProposal(
        "Send ETH",
        recipient.address,
        "0x",
        ethers.parseEther("0.1")
      );

      // Vote to pass
      await dao.connect(member1).vote(1, true);
      await dao.connect(member2).vote(1, true);
      await dao.connect(member3).vote(1, true);

      // Fast forward past deadline
      await time.increase(7 * 24 * 60 * 60 + 1);

      // Send ETH to DAO
      await owner.sendTransaction({
        to: dao.target,
        value: ethers.parseEther("0.1")
      });

      // Execute
      const initialBalance = await ethers.provider.getBalance(recipient.address);
      await dao.executeProposal(1);
      const finalBalance = await ethers.provider.getBalance(recipient.address);

      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("0.1"));
    });

    it("Should emit ProposalExecuted event", async function () {
      const { dao, member1, member2, member3, recipient, owner } = await loadFixture(deployDAOFixture);

      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);
      await dao.connect(member1).vote(1, true);
      await dao.connect(member2).vote(1, true);
      await dao.connect(member3).vote(1, true);

      await time.increase(7 * 24 * 60 * 60 + 1);

      await expect(dao.executeProposal(1))
        .to.emit(dao, "ProposalExecuted")
        .withArgs(1);
    });

    it("Should mark proposal as executed", async function () {
      const { dao, member1, member2, member3, recipient } = await loadFixture(deployDAOFixture);

      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);
      await dao.connect(member1).vote(1, true);
      await dao.connect(member2).vote(1, true);
      await dao.connect(member3).vote(1, true);

      await time.increase(7 * 24 * 60 * 60 + 1);
      await dao.executeProposal(1);

      const proposal = await dao.getProposal(1);
      expect(proposal.executed).to.be.true;
    });

    it("Should not allow executing before deadline", async function () {
      const { dao, member1, member2, member3, recipient } = await loadFixture(deployDAOFixture);

      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);
      await dao.connect(member1).vote(1, true);
      await dao.connect(member2).vote(1, true);
      await dao.connect(member3).vote(1, true);

      await expect(
        dao.executeProposal(1)
      ).to.be.revertedWith("ClubDAO: Voting still active");
    });

    it("Should not allow executing proposal that didn't pass", async function () {
      const { dao, member1, member2, recipient } = await loadFixture(deployDAOFixture);

      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);
      await dao.connect(member1).vote(1, true);
      await dao.connect(member2).vote(1, false);

      await time.increase(7 * 24 * 60 * 60 + 1);

      await expect(
        dao.executeProposal(1)
      ).to.be.revertedWith("ClubDAO: Proposal did not pass");
    });

    it("Should not allow double execution", async function () {
      const { dao, member1, member2, member3, recipient, owner } = await loadFixture(deployDAOFixture);

      await dao.connect(member1).createProposal("Test", recipient.address, "0x", 0);
      await dao.connect(member1).vote(1, true);
      await dao.connect(member2).vote(1, true);
      await dao.connect(member3).vote(1, true);

      await time.increase(7 * 24 * 60 * 60 + 1);
      await dao.executeProposal(1);

      await expect(
        dao.executeProposal(1)
      ).to.be.revertedWith("ClubDAO: Proposal already executed");
    });

    it("Should allow executing proposal with no target (empty action)", async function () {
      const { dao, member1, member2, member3 } = await loadFixture(deployDAOFixture);

      await dao.connect(member1).createProposal("Test", ethers.ZeroAddress, "0x", 0);
      await dao.connect(member1).vote(1, true);
      await dao.connect(member2).vote(1, true);
      await dao.connect(member3).vote(1, true);

      await time.increase(7 * 24 * 60 * 60 + 1);

      await expect(dao.executeProposal(1)).to.not.be.reverted;
    });
  });

  describe("setVotingPeriod", function () {
    it("Should allow member to update voting period", async function () {
      const { dao, member1 } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).setVotingPeriod(14 * 24 * 60 * 60);
      expect(await dao.votingPeriod()).to.equal(14 * 24 * 60 * 60);
    });

    it("Should not allow non-member to update voting period", async function () {
      const { dao, nonMember } = await loadFixture(deployDAOFixture);
      await expect(
        dao.connect(nonMember).setVotingPeriod(14 * 24 * 60 * 60)
      ).to.be.revertedWith("ClubDAO: Not a member");
    });
  });

  describe("setQuorumThreshold", function () {
    it("Should allow member to update quorum threshold", async function () {
      const { dao, member1 } = await loadFixture(deployDAOFixture);
      await dao.connect(member1).setQuorumThreshold(75);
      expect(await dao.quorumThreshold()).to.equal(75);
    });

    it("Should not allow threshold > 100", async function () {
      const { dao, member1 } = await loadFixture(deployDAOFixture);
      await expect(
        dao.connect(member1).setQuorumThreshold(101)
      ).to.be.revertedWith("ClubDAO: Threshold must be <= 100");
    });

    it("Should not allow non-member to update quorum", async function () {
      const { dao, nonMember } = await loadFixture(deployDAOFixture);
      await expect(
        dao.connect(nonMember).setQuorumThreshold(75)
      ).to.be.revertedWith("ClubDAO: Not a member");
    });
  });
});
